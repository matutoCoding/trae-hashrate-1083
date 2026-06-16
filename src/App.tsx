import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Grinding } from "@/pages/Grinding";
import { Pressing } from "@/pages/Pressing";
import { Cultivation } from "@/pages/Cultivation";
import { Bottling } from "@/pages/Bottling";
import { Fermentation } from "@/pages/Fermentation";
import { Packaging } from "@/pages/Packaging";
import { Sales } from "@/pages/Sales";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="grinding" element={<Grinding />} />
          <Route path="pressing" element={<Pressing />} />
          <Route path="cultivation" element={<Cultivation />} />
          <Route path="bottling" element={<Bottling />} />
          <Route path="fermentation" element={<Fermentation />} />
          <Route path="packaging" element={<Packaging />} />
          <Route path="sales" element={<Sales />} />
        </Route>
      </Routes>
    </Router>
  );
}
