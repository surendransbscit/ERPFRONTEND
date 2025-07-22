import { createContext, useContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { v4 as uuidv4 } from "uuid";

const SessionContext = createContext();

export const AuthSessionProvider = ({ children }) => {
  // const [tabId] = useState(() => crypto.randomUUID());
  const [tabId] = useState(() => uuidv4());
  const [isActive, setIsActive] = useState(true);
  const loginpref = secureLocalStorage?.getItem("pref")?.pref;

  useEffect(() => {
    sessionStorage.setItem("tabId", tabId);

    // Add this tab to activeTabs list
    const registerTab = () => {
      const existing = JSON.parse(localStorage.getItem("activeTabs") || "[]");
      if (!existing.includes(tabId)) {
        localStorage.setItem(
          "activeTabs",
          JSON.stringify([...existing, tabId])
        );
      }
    };

    // Remove this tab on unload
    const cleanupTab = () => {
      const existing = JSON.parse(localStorage.getItem("activeTabs") || "[]");
      const updated = existing.filter((id) => id !== tabId);

      if (loginpref && updated?.length === 0) {
        // Last tab closed - clear everything
        localStorage.clear(); // or selectively remove items
      } else {
        localStorage.setItem("activeTabs", JSON.stringify(updated));
      }

      localStorage.removeItem(`tabStatus-${tabId}`);
    };

    const updateStatus = () => {
      const state =
        document.visibilityState === "visible" ? "active" : "inactive";
      setIsActive(state === "active");
      localStorage.setItem(`tabStatus-${tabId}`, state);
    };

    registerTab();
    updateStatus();

    window.addEventListener("beforeunload", cleanupTab);
    document.addEventListener("visibilitychange", updateStatus);
    window.addEventListener("focus", updateStatus);
    window.addEventListener("blur", updateStatus);

    return () => {
      cleanupTab();
      window.removeEventListener("beforeunload", cleanupTab);
      document.removeEventListener("visibilitychange", updateStatus);
      window.removeEventListener("focus", updateStatus);
      window.removeEventListener("blur", updateStatus);
    };
  }, [tabId]);

  // useEffect(() => {
  //   sessionStorage.setItem("tabId", tabId);

  //   const registerTab = () => {
  //     const existing = JSON.parse(localStorage.getItem("activeTabs") || "[]");
  //     if (!existing.includes(tabId)) {
  //       localStorage.setItem(
  //         "activeTabs",
  //         JSON.stringify([...existing, tabId])
  //       );
  //     }
  //   };

  //   const cleanupTab = (isReload = false) => {
  //     if (isReload) return;

  //     const existing = JSON.parse(localStorage.getItem("activeTabs") || "[]");
  //     const updated = existing.filter((id) => id !== tabId);

  //     if (loginpref && updated.length === 0) {
  //       localStorage.clear(); // Last tab closed
  //     } else {
  //       localStorage.setItem("activeTabs", JSON.stringify(updated));
  //     }

  //     localStorage.removeItem(`tabStatus-${tabId}`);
  //   };

  //   const updateStatus = () => {
  //     const state =
  //       document.visibilityState === "visible" ? "active" : "inactive";
  //     setIsActive(state === "active");
  //     localStorage.setItem(`tabStatus-${tabId}`, state);
  //   };

  //   registerTab();
  //   updateStatus();

  //   // Use `pagehide` to detect if page is persisted (i.e., reload, bfcache)
  //   const handlePageHide = (e) => {
  //     const isReload =
  //       e.persisted ||
  //       performance.getEntriesByType("navigation")[0]?.type === "reload";
  //     cleanupTab(isReload);
  //   };

  //   window.addEventListener("pagehide", handlePageHide);
  //   document.addEventListener("visibilitychange", updateStatus);
  //   window.addEventListener("focus", updateStatus);
  //   window.addEventListener("blur", updateStatus);

  //   return () => {
  //     cleanupTab();
  //     window.removeEventListener("pagehide", handlePageHide);
  //     document.removeEventListener("visibilitychange", updateStatus);
  //     window.removeEventListener("focus", updateStatus);
  //     window.removeEventListener("blur", updateStatus);
  //   };
  // }, [tabId]);

  return (
    <SessionContext.Provider
      value={{
        tabId,
        isActive,
        getActiveTabs: () => {
          const tabIds = JSON.parse(localStorage.getItem("activeTabs") || "[]");
          return tabIds.filter(
            (id) => localStorage.getItem(`tabStatus-${id}`) === "active"
          );
        },
        getAllTabStatuses: () => {
          const tabIds = JSON.parse(localStorage.getItem("activeTabs") || "[]");
          return tabIds.map((id) => ({
            id,
            status: localStorage.getItem(`tabStatus-${id}`),
          }));
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
