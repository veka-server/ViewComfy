import { SquareTerminal, LifeBuoy, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TooltipButton } from "@/components/ui/tooltip-button"
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query"

export enum TabValue {
    Playground = 'playground',
    Models = 'models',
    API = 'api',
    Documentation = 'documentation',
    Settings = 'settings',
    Help = 'help',
    Account = 'account',
    WorkflowApi = 'workflow_api'
}

interface SidebarProps {
    currentTab: TabValue;
    onTabChange: (tab: TabValue) => void;
}
type SystemStats = {
    system: {
        os: string;
        ram_total: number;
        ram_free: number;
        comfyui_version: string;
        python_version: string;
        pytorch_version: string;
        embedded_python: boolean;
        argv: string[];
    };
    devices: {
        name: string;
        type: string;
        index: number;
        vram_total: number;
        vram_free: number;
        torch_vram_total: number;
        torch_vram_free: number;
    }[];
};

async function fetchSystemStats(): Promise<SystemStats> {
    const apiUrl = "http://comfyui:8188/api/system_stats";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: SystemStats = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch system stats:", error);
        throw error;
    }
}

const SidebarButton = ({ icon, label, isActive, onClick, isSmallScreen }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, isSmallScreen: boolean }) => {
    if (isSmallScreen) {
        return (
            <TooltipButton
                icon={icon}
                label={label}
                tooltipContent={label}
                className={isActive ? 'bg-muted' : ''}
                onClick={onClick}
            />
        )
    }
    return (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={onClick}
        >
            {icon}
            <span className="ml-2">{label}</span>
        </Button>
    )
}

export function Sidebar({ currentTab, onTabChange }: SidebarProps) {
    const viewMode = process.env.NEXT_PUBLIC_VIEW_MODE === "true";
    const isSmallScreen = useMediaQuery("(max-width: 1024px)");
        const stats = await fetchSystemStats();
        console.log("System Stats:", stats);
    return (
        <aside className={`flex flex-col h-full overflow-y-auto border-r bg-background transition-all duration-300 ${isSmallScreen ? 'w-12' : 'w-48'}`}>
            <nav className="flex-grow space-y-2 p-2">
                {viewMode ? (
                    <SidebarButton
                        icon={<SquareTerminal className="size-5" />}
                        label="Playground"
                        isActive={currentTab === TabValue.Playground}
                        onClick={() => onTabChange(TabValue.Playground)}
                        isSmallScreen={isSmallScreen}
                    />
                ) : (
                    <>
                        <SidebarButton
                            icon={<FileJson className="size-5" />}
                            label="Editor"
                            isActive={currentTab === TabValue.WorkflowApi}
                            onClick={() => onTabChange(TabValue.WorkflowApi)}
                            isSmallScreen={isSmallScreen}
                        />
                        <SidebarButton
                            icon={<SquareTerminal className="size-5" />}
                            label="Playground"
                            isActive={currentTab === TabValue.Playground}
                            onClick={() => onTabChange(TabValue.Playground)}
                            isSmallScreen={isSmallScreen}
                        />
                    </>
                )}
            </nav>

            { !isSmallScreen && (
                <div className="bottom-0 p-2 bg-background border-t text-sm bg-muted items-center justify-center text-center text-muted-foreground">
                  <ul>
                    <li><strong>Python :</strong> 254654</li>
                    <li><strong>PyTorch :</strong> 25468</li>
                    <li><strong>ComfyUI :</strong> 54654</li>
                    <li><strong>GPU :</strong> Nvidia 3060 12G</li>
                  </ul>
                </div>
            )}
            
            <nav className="sticky bottom-0 p-2 bg-background border-t">
                <Link href="https://github.com/ViewComfy/ViewComfy" target="_blank" rel="noopener noreferrer">
                    {isSmallScreen ? (
                        <TooltipButton
                            icon={<LifeBuoy className="size-5" />}
                            label="Help"
                            tooltipContent="Help"
                            variant="outline"
                        />
                    ) : (
                        <Button variant="outline" className="w-full justify-start">
                            <LifeBuoy className="size-5 mr-2" />
                            Help
                        </Button>
                    )}
                </Link>
            </nav>
        </aside>
    )
}
