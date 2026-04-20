import { Sidebar } from './components/Sidebar';
import { CanvasView } from './components/CanvasView';
import { RightPanel } from './components/RightPanel';
import { ControlBar } from './components/ControlBar';
import { GcodePanel } from './components/GcodePanel';
import { useStudioStore } from './lib/store';

export default function App() {
  const projectName = useStudioStore((s) => s.projectName);
  const resetProject = useStudioStore((s) => s.resetProject);
  const saveProject = useStudioStore((s) => s.saveProject);
  const openProject = useStudioStore((s) => s.openProject);
  const exportGcode = useStudioStore((s) => s.exportGcode);
  const importSvg = useStudioStore((s) => s.importSvg);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <strong>Tyvok Studio</strong>
          <span>{projectName}</span>
        </div>
        <div className="topbar-actions">
          <button onClick={resetProject}>New</button>
          <button onClick={() => void openProject()}>Open</button>
          <button onClick={() => void saveProject()}>Save</button>
          <button onClick={() => void importSvg()}>Import SVG</button>
          <button onClick={() => void exportGcode()}>Export G-code</button>
        </div>
      </header>

      <main className="workspace">
        <Sidebar />
        <div className="center-column">
          <CanvasView />
          <GcodePanel />
        </div>
        <RightPanel />
      </main>

      <ControlBar />
    </div>
  );
}
