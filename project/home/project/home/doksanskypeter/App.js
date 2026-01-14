import React, { useState, useEffect } from "react";

export default function IDOS_Final_System() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("idos_config");
    return saved
      ? JSON.parse(saved)
      : {
          userName: "IDOS",
          userPhoto: "https://i.postimg.cc/85zXqf6X/avatar.png",
          accentColor: "#f1c40f",
          dockPos: "top",
          blur: 15,
          opacity: 0.5,
          startBlur: 10,
          startOpacity: 0.9,
          wallpaper: "https://i.postimg.cc/mD39V89V/gold-wallpaper.jpg",
          startIcon: "▦",
          sysIcons: { close: "×", restart: "↻", power: "⏻" },
        };
  });

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem("idos_menu");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "plocha", name: "PRACovná PLOCHA", icon: "📁" },
          { id: "dokumenty", name: "DOKUMENTY", icon: "📁" },
          { id: "obrázky", name: "OBRÁZKY", icon: "📁" },
          { id: "hudba", name: "HUDBA", icon: "📁" },
          { id: "videá", name: "VIDEÁ", icon: "📁" },
          { id: "internet", name: "INTERNET", icon: "🌐" },
          { id: "nastavenia", name: "NASTAVENIA", icon: "⚙️" },
        ];
  });

  const [windows, setWindows] = useState([]);
  const [activeWin, setActiveWin] = useState(null);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [time, setTime] = useState("");
  const [urlInput, setUrlInput] = useState(
    "https://www.google.com/search?igu=1"
  );

  useEffect(() => {
    localStorage.setItem("idos_config", JSON.stringify(config));
    localStorage.setItem("idos_menu", JSON.stringify(menuItems));
    const t = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
      1000
    );
    return () => clearInterval(t);
  }, [config, menuItems]);

  const openApp = (id, name, icon) => {
    const barH = 48;
    const h = (window.innerHeight - barH) / 2;
    const w = window.innerWidth / 2;
    const positions = [
      { x: 0, y: 48, w, h },
      { x: w, y: 48, w, h },
      { x: 0, y: h + 48, w, h },
      { x: w, y: h + 48, w, h },
    ];
    let freePosIndex = positions.findIndex(
      (pos) =>
        !windows.some(
          (win) => win.x === pos.x && win.y === pos.y && !win.isMinimized
        )
    );
    if (freePosIndex === -1) freePosIndex = windows.length % 4;
    setWindows([
      ...windows,
      {
        instanceId: Date.now(),
        id,
        name,
        icon,
        ...positions[freePosIndex],
        isMaximized: false,
        isMinimized: false,
      },
    ]);
    setIsStartOpen(false);
  };

  const handleMenuRightClick = (e, itemId) => {
    e.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = (ev) => {
      const reader = new FileReader();
      reader.onload = (re) =>
        setMenuItems((prev) =>
          prev.map((it) =>
            it.id === itemId ? { ...it, icon: re.target.result } : it
          )
        );
      reader.readAsDataURL(ev.target.files[0]);
    };
    fileInput.click();
  };

  const renderIcon = (data, cls = "w-full h-full") =>
    typeof data === "string" && data.startsWith("data:image") ? (
      <img src={data} className={`${cls} object-contain`} alt="" />
    ) : (
      data
    );

  return (
    <div
      className="h-screen w-full relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${config.wallpaper})` }}
    >
      <div
        className="absolute w-full h-12 flex items-center justify-between px-4 z-[5000]"
        style={{
          top: 0,
          backgroundColor: `rgba(0,0,0,${config.opacity})`,
          backdropFilter: `blur(${config.blur}px)`,
          color: config.accentColor,
        }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            className="w-10 h-10 bg-amber-600 rounded flex items-center justify-center border border-white/20"
          >
            <div className="w-7 h-7">{renderIcon(config.startIcon)}</div>
          </button>
          <div className="flex gap-2 ml-4">
            {windows.map((w) => (
              <button
                key={w.instanceId}
                onClick={() =>
                  setWindows((ps) =>
                    ps.map((win) =>
                      win.instanceId === w.instanceId
                        ? { ...win, isMinimized: false }
                        : win
                    )
                  )
                }
                className={`w-9 h-9 p-1.5 rounded border ${
                  activeWin === w.instanceId && !w.isMinimized
                    ? "bg-amber-600 border-white"
                    : "bg-white/10 border-white/20"
                }`}
              >
                {renderIcon(w.icon)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 text-xl">
          <div className="w-6 h-6">{renderIcon(config.sysIcons.close)}</div>
          <div className="w-6 h-6">{renderIcon(config.sysIcons.restart)}</div>
          <div className="w-6 h-6">{renderIcon(config.sysIcons.power)}</div>
          <b className="text-xs font-mono">{time}</b>
        </div>
      </div>

      {isStartOpen && (
        <div
          className="absolute top-14 left-2 w-72 border-2 border-amber-800 rounded z-[6000] overflow-hidden shadow-2xl transition-all"
          style={{
            backgroundColor: `rgba(255,255,255,${config.startOpacity})`,
            backdropFilter: `blur(${config.startBlur}px)`,
          }}
        >
          <div className="p-4 bg-amber-900 text-white flex items-center gap-3">
            <img
              src={config.userPhoto}
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
              alt=""
            />
            <b
              className="text-xs uppercase"
              style={{ color: config.accentColor }}
            >
              {config.userName}
            </b>
          </div>
          <div className="p-2 space-y-1 text-black font-bold">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => openApp(item.id, item.name, item.icon)}
                onContextMenu={(e) => handleMenuRightClick(e, item.id)}
                className="w-full text-left px-4 py-2 hover:bg-amber-700 hover:text-white rounded text-[10px] flex items-center gap-3 transition-colors"
              >
                <span className="w-5 h-5">{renderIcon(item.icon)}</span>
                <span className="flex-1">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {windows.map(
        (win) =>
          !win.isMinimized && (
            <div
              key={win.instanceId}
              onClick={() => setActiveWin(win.instanceId)}
              style={{
                left: win.isMaximized ? 0 : win.x,
                top: win.isMaximized ? 48 : win.y,
                width: win.isMaximized ? "100%" : win.w,
                height: win.isMaximized ? "calc(100% - 48px)" : win.h,
                zIndex: activeWin === win.instanceId ? 100 : 10,
                backgroundColor: `rgba(255,255,255,${config.startOpacity})`,
                backdropFilter: `blur(${config.startBlur}px)`,
              }}
              className="absolute border border-amber-800 shadow-2xl flex flex-col transition-all"
            >
              <div
                className="h-8 flex justify-between items-center px-2 cursor-move border-b border-amber-600"
                style={{
                  backgroundColor: `rgba(0,0,0,${config.opacity})`,
                  backdropFilter: `blur(${config.blur}px)`,
                }}
              >
                <span
                  className="text-[10px] font-black uppercase"
                  style={{ color: config.accentColor }}
                >
                  {win.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWindows((ps) =>
                        ps.map((w) =>
                          w.instanceId === win.instanceId
                            ? { ...w, isMinimized: true }
                            : w
                        )
                      );
                    }}
                    className="w-4 h-4 bg-yellow-500 rounded-full border border-yellow-700 text-black font-bold text-[8px] flex items-center justify-center"
                  >
                    _
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWindows((ps) =>
                        ps.map((w) =>
                          w.instanceId === win.instanceId
                            ? { ...w, isMaximized: !w.isMaximized }
                            : w
                        )
                      );
                    }}
                    className="w-4 h-4 bg-green-600 rounded-full border border-green-800 text-black font-bold text-[8px] flex items-center justify-center"
                  >
                    ▢
                  </button>
                  <button
                    onClick={() =>
                      setWindows(
                        windows.filter((w) => w.instanceId !== win.instanceId)
                      )
                    }
                    className="w-4 h-4 bg-red-600 rounded-full border border-red-800 text-white font-bold text-[8px] flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden flex flex-col">
                {win.id === "nastavenia" ? (
                  <div className="p-4 space-y-4 text-[11px] font-bold h-full overflow-y-auto uppercase">
                    <p className="border-b-2 border-amber-600 text-amber-700 pb-1 font-black">
                      NASTAVENIA
                    </p>
                    <div className="space-y-4 text-[9px]">
                      <label className="block border-b pb-2">
                        FARBA PÍSMA:{" "}
                        <input
                          type="color"
                          className="w-full h-8 mt-1"
                          value={config.accentColor}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              accentColor: e.target.value,
                            })
                          }
                        />
                      </label>
                      <div className="bg-amber-50/50 p-2 rounded border border-amber-100 shadow-sm">
                        <p className="text-amber-800 mb-2 border-b font-black">
                          LÍŠTY
                        </p>
                        <label className="flex justify-between items-center">
                          ROZMAZANIE:{" "}
                          <input
                            type="range"
                            className="w-32"
                            min="0"
                            max="30"
                            value={config.blur}
                            onChange={(e) =>
                              setConfig({ ...config, blur: e.target.value })
                            }
                          />
                        </label>
                        <label className="flex justify-between items-center mt-2">
                          PRIEHLADNOSŤ:{" "}
                          <input
                            type="range"
                            className="w-32"
                            min="0"
                            max="1"
                            step="0.1"
                            value={config.opacity}
                            onChange={(e) =>
                              setConfig({ ...config, opacity: e.target.value })
                            }
                          />
                        </label>
                      </div>
                      <div className="bg-amber-50/50 p-2 rounded border border-amber-100 shadow-sm">
                        <p className="text-amber-800 mb-2 border-b font-black">
                          ŠTART & OKNÁ
                        </p>
                        <label className="flex justify-between items-center">
                          ROZMAZANIE:{" "}
                          <input
                            type="range"
                            className="w-32"
                            min="0"
                            max="30"
                            value={config.startBlur}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                startBlur: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="flex justify-between items-center mt-2">
                          PRIEHLADNOSŤ:{" "}
                          <input
                            type="range"
                            className="w-32"
                            min="0"
                            max="1"
                            step="0.1"
                            value={config.startOpacity}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                startOpacity: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                      <p className="text-amber-700 border-b font-black">
                        MULTIMÉDIA
                      </p>
                      <div className="flex justify-between bg-white/50 p-1 border rounded shadow-sm">
                        <span>TAPETA:</span>
                        <input
                          type="file"
                          onChange={(e) => {
                            const f = e.target.files[0];
                            if (f) {
                              const r = new FileReader();
                              r.onload = (ev) =>
                                setConfig({
                                  ...config,
                                  wallpaper: ev.target.result,
                                });
                              r.readAsDataURL(f);
                            }
                          }}
                          className="w-32 text-[7px]"
                        />
                      </div>
                      <div className="flex justify-between bg-white/50 p-1 border rounded shadow-sm">
                        <span>FOTO:</span>
                        <input
                          type="file"
                          onChange={(e) => {
                            const f = e.target.files[0];
                            if (f) {
                              const r = new FileReader();
                              r.onload = (ev) =>
                                setConfig({
                                  ...config,
                                  userPhoto: ev.target.result,
                                });
                              r.readAsDataURL(f);
                            }
                          }}
                          className="w-32 text-[7px]"
                        />
                      </div>
                    </div>
                  </div>
                ) : win.id === "internet" ? (
                  <iframe
                    src={urlInput}
                    className="w-full h-full border-none bg-white"
                    title="browser"
                  />
                ) : (
                  <div className="p-10 text-center text-amber-900/20 font-black italic h-full flex items-center justify-center uppercase">
                    NAS SYNC: {win.name}
                  </div>
                )}
              </div>
            </div>
          )
      )}
    </div>
  );
}
