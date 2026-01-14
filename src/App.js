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
          blur: 15,
          opacity: 0.5,
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

  const handleIconChange = (e, target, id = null) => {
    e.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = (ev) => {
      const reader = new FileReader();
      reader.onload = (re) => {
        if (target === "start")
          setConfig((p) => ({ ...p, startIcon: re.target.result }));
        else if (target === "sys")
          setConfig((p) => ({
            ...p,
            sysIcons: { ...p.sysIcons, [id]: re.target.result },
          }));
        else if (target === "menu")
          setMenuItems((prev) =>
            prev.map((it) =>
              it.id === id ? { ...it, icon: re.target.result } : it
            )
          );
        else if (target === "win")
          setWindows((prev) =>
            prev.map((w) =>
              w.instanceId === id ? { ...w, icon: re.target.result } : w
            )
          );
      };
      reader.readAsDataURL(ev.target.files[0]);
    };
    fileInput.click();
  };

  const openApp = (id, name, icon) => {
    const barH = 48;
    const h = (window.innerHeight - barH) / 2;
    const w = window.innerWidth / 2;
    const pos = [
      { x: 0, y: 48, w, h },
      { x: w, y: 48, w, h },
      { x: 0, y: h + 48, w, h },
      { x: w, y: h + 48, w, h },
    ];
    setWindows([
      ...windows,
      {
        instanceId: Date.now(),
        id,
        name,
        icon,
        ...pos[windows.length % 4],
        isMinimized: false,
        isMaximized: false,
        nas: {
          ip: "",
          user: "",
          pass: "",
          connected: false,
          currentFolder: null,
        },
      },
    ]);
    setIsStartOpen(false);
  };

  const updateNas = (instanceId, field, value) =>
    setWindows((prev) =>
      prev.map((w) =>
        w.instanceId === instanceId
          ? { ...w, nas: { ...w.nas, [field]: value } }
          : w
      )
    );
  const renderIcon = (data, size = "w-full h-full") =>
    typeof data === "string" && data.startsWith("data:image") ? (
      <img src={data} className={`${size} object-contain`} alt="" />
    ) : (
      data
    );

  return (
    <div
      className="h-screen w-full relative overflow-hidden bg-cover bg-center font-black uppercase"
      style={{ backgroundImage: `url(${config.wallpaper})` }}
    >
      {/* TASKBAR - KONTAKTY VPRAVO S AKTÍVNOU ZMENOU CEZ PRAVÝ KLIK */}
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
            onContextMenu={(e) => handleIconChange(e, "start")}
            className="w-10 h-10 bg-amber-600 rounded flex items-center justify-center text-black active:scale-95 text-xl font-black"
          >
            {renderIcon(config.startIcon)}
          </button>
          {windows.map((w) => (
            <button
              key={w.instanceId}
              onClick={() => {
                setActiveWin(w.instanceId);
                setWindows(
                  windows.map((win) =>
                    win.instanceId === w.instanceId
                      ? { ...win, isMinimized: false }
                      : win
                  )
                );
              }}
              onContextMenu={(e) => handleIconChange(e, "win", w.instanceId)}
              className={`w-9 h-9 p-2 rounded border flex items-center justify-center ${
                activeWin === w.instanceId
                  ? "bg-amber-600 border-white"
                  : "bg-white/10 border-white/20"
              }`}
            >
              {renderIcon(w.icon, "w-5 h-5")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button
            className="w-6 h-6 flex items-center justify-center text-lg font-black"
            onContextMenu={(e) => handleIconChange(e, "sys", "close")}
            onClick={() => setWindows([])}
          >
            {renderIcon(config.sysIcons.close)}
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center text-lg font-black"
            onContextMenu={(e) => handleIconChange(e, "sys", "restart")}
            onClick={() => window.location.reload()}
          >
            {renderIcon(config.sysIcons.restart)}
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center text-lg text-red-500 font-black"
            onContextMenu={(e) => handleIconChange(e, "sys", "power")}
            onClick={() => alert("VYPÍNANIE...")}
          >
            {renderIcon(config.sysIcons.power)}
          </button>
          <b
            className="text-[11px] font-mono ml-2 tracking-tighter"
            style={{ color: config.accentColor }}
          >
            {time}
          </b>
        </div>
      </div>

      {/* START MENU */}
      {isStartOpen && (
        <div
          className="absolute top-14 left-2 w-72 border border-amber-800 shadow-2xl z-[6000] overflow-hidden flex flex-col border-t-2 uppercase"
          style={{
            backgroundColor: `rgba(255,255,255,${config.opacity})`,
            backdropFilter: `blur(${config.blur}px)`,
          }}
        >
          <div
            className="p-4 flex items-center gap-4 border-b border-amber-600/50"
            style={{ backgroundColor: `rgba(0,0,0,${config.opacity})` }}
          >
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
          <div className="p-2 space-y-1 text-black text-[9px] font-black">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => openApp(item.id, item.name, item.icon)}
                onContextMenu={(e) => handleIconChange(e, "menu", item.id)}
                className="w-full text-left px-4 py-2 hover:bg-amber-700 hover:text-white rounded flex items-center gap-3 transition-all font-black"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {renderIcon(item.icon)}
                </div>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WINDOWS */}
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
                backgroundColor: `rgba(255,255,255,${config.opacity})`,
                backdropFilter: `blur(${config.blur}px)`,
              }}
              className="absolute border border-amber-800 shadow-2xl flex flex-col transition-all overflow-hidden border-t-2 text-black font-black uppercase"
            >
              <div
                className="h-8 flex justify-between items-center px-2 border-b border-amber-600/50"
                style={{
                  backgroundColor: `rgba(0,0,0,${config.opacity})`,
                  backdropFilter: `blur(${config.blur}px)`,
                }}
              >
                <span
                  className="text-[10px] italic font-black"
                  style={{ color: config.accentColor }}
                >
                  {win.name}
                </span>
                <div className="flex gap-2 font-black">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWindows(
                        windows.map((w) =>
                          w.instanceId === win.instanceId
                            ? { ...w, isMinimized: true }
                            : w
                        )
                      );
                    }}
                    className="w-4 h-4 bg-yellow-500 rounded-full border border-yellow-700 text-[8px] flex items-center justify-center font-black"
                  >
                    _
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWindows(
                        windows.map((w) =>
                          w.instanceId === win.instanceId
                            ? { ...w, isMaximized: !w.isMaximized }
                            : w
                        )
                      );
                    }}
                    className="w-4 h-4 bg-green-600 rounded-full border border-green-800 text-[8px] flex items-center justify-center font-black"
                  >
                    ▢
                  </button>
                  <button
                    onClick={() =>
                      setWindows(
                        windows.filter((w) => w.instanceId !== win.instanceId)
                      )
                    }
                    className="w-4 h-4 bg-red-600 rounded-full border border-red-800 text-white text-[8px] flex items-center justify-center font-black"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden">
                {win.id === "nastavenia" ? (
                  <div className="p-5 space-y-4 text-[11px] h-full overflow-y-auto">
                    <p className="border-b-2 border-amber-600 text-amber-800 pb-1 italic font-black">
                      SYSTÉM
                    </p>
                    <label className="block">
                      MENO KONTA:{" "}
                      <input
                        className="w-full border p-1 text-[9px] mt-1 rounded font-black outline-none text-black uppercase shadow-sm"
                        value={config.userName}
                        onChange={(e) =>
                          setConfig({ ...config, userName: e.target.value })
                        }
                      />
                    </label>
                    <div className="flex justify-between items-center bg-amber-50/50 p-2 border rounded shadow-sm text-[9px] font-black">
                      <span>FOTO KONTAKTU:</span>
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
                        className="w-32 font-black"
                      />
                    </div>
                    <div className="flex justify-between items-center bg-amber-50/50 p-2 border rounded shadow-sm text-[9px] font-black">
                      <span>TAPETA PLOCHY:</span>
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
                        className="w-32 font-black"
                      />
                    </div>
                    <label className="block border-b border-amber-800/10 pb-2 font-black">
                      FARBA PÍSMA:{" "}
                      <input
                        type="color"
                        className="w-full h-8 mt-1 cursor-pointer font-black"
                        value={config.accentColor}
                        onChange={(e) =>
                          setConfig({ ...config, accentColor: e.target.value })
                        }
                      />
                    </label>
                    <div className="p-3 rounded border border-amber-100 shadow-sm font-black">
                      <p className="text-amber-800 mb-2 border-b text-[10px]">
                        VIZUÁL
                      </p>
                      <input
                        type="range"
                        className="w-full"
                        min="0"
                        max="30"
                        value={config.blur}
                        onChange={(e) =>
                          setConfig({ ...config, blur: e.target.value })
                        }
                      />
                      <input
                        type="range"
                        className="w-full mt-2"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.opacity}
                        onChange={(e) =>
                          setConfig({ ...config, opacity: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ) : win.id === "internet" ? (
                  <iframe
                    src="https://www.google.com/search?igu=1"
                    className="w-full h-full border-none bg-white font-black"
                    title="browser"
                  />
                ) : (
                  <div className="flex flex-col h-full bg-white/20 font-black">
                    {!win.nas.connected ? (
                      <div className="p-6 flex flex-col gap-3 h-full justify-center items-center font-black">
                        <p className="text-[10px] text-amber-900 mb-2 font-black italic">
                          PRIHLÁSENIE K NAS ({win.name})
                        </p>
                        <input
                          className="w-full max-w-xs bg-white/70 border border-amber-800/30 p-2 text-[10px] rounded font-bold outline-none uppercase"
                          placeholder="IP ADRESA"
                          value={win.nas.ip}
                          onChange={(e) =>
                            updateNas(win.instanceId, "ip", e.target.value)
                          }
                        />
                        <input
                          className="w-full max-w-xs bg-white/70 border border-amber-800/30 p-2 text-[10px] rounded font-bold outline-none uppercase"
                          placeholder="MENO"
                          value={win.nas.user}
                          onChange={(e) =>
                            updateNas(win.instanceId, "user", e.target.value)
                          }
                        />
                        <input
                          className="w-full max-w-xs bg-white/70 border border-amber-800/30 p-2 text-[10px] rounded font-bold outline-none uppercase"
                          type="password"
                          placeholder="HESLO"
                          value={win.nas.pass}
                          onChange={(e) =>
                            updateNas(win.instanceId, "pass", e.target.value)
                          }
                        />
                        <button
                          className="w-full max-w-xs bg-amber-900 text-white text-[10px] py-2 rounded shadow-lg uppercase active:scale-95 font-black"
                          onClick={() =>
                            updateNas(win.instanceId, "connected", true)
                          }
                        >
                          Pripojiť
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 flex flex-col h-full font-black">
                        <div className="flex justify-between items-center border-b border-amber-800/30 pb-1 mb-4 text-[9px] font-black italic">
                          <span>
                            📁{" "}
                            {win.nas.currentFolder
                              ? win.nas.currentFolder
                              : "TrueNAS: " + win.nas.ip}
                          </span>
                          {win.nas.currentFolder && (
                            <button
                              className="text-amber-900 underline font-black"
                              onClick={() =>
                                updateNas(win.instanceId, "currentFolder", null)
                              }
                            >
                              SPÄŤ
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
      )}
    </div>
  );
}
