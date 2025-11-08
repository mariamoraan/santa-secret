import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "../../features/groups/ui/pages/home.page";
import { PATHNAMES } from "./pathnames";
import { GroupViewPage } from "../../features/groups/ui/pages/group-view.page";
import { ConfigPage } from "../../features/groups/ui/pages/config.page";

export const AppRouter= () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage/>} />
        <Route path={PATHNAMES.GROUP_VIEW_DEF} element={<GroupViewPage />} />
        <Route path={PATHNAMES.CONFIG_DEF} element={<ConfigPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;