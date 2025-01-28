import React from "react";
import { ProgressBarComponent, ProgressAnnotation } from "@syncfusion/ej2-react-progressbar";
import { useProgress } from "../context/ProgressContext";
import { Inject } from '@syncfusion/ej2-react-grids';

const GlobalProgressBar: React.FC = () => {
  const { progress, isLoading,displayedProgress,loadingMessage } = useProgress();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        {/* <div className="mb-4 text-center text-lg font-semibold">Loading Data...{tabs[selectedIndex].id}</div> */}
                        <div className="mb-4 text-center text-lg font-semibold">{loadingMessage}</div>
                        <div className="flex justify-center">
                            {progress > 0 && (
                                <div className="relative">
                                    <ProgressBarComponent
                                        id="circular-progress"
                                        type="Circular"
                                        height="160px"
                                        width="160px"
                                        trackThickness={15}
                                        progressThickness={15}
                                        cornerRadius="Round"
                                        trackColor="#f3f3f3"
                                        progressColor="#3b3f5c"
                                        animation={{
                                            enable: true,
                                            duration: 2000, // Match this with the total time of the counter animation
                                            delay: 0,
                                        }}
                                        value={progress}
                                    >
                                        <Inject services={[ProgressAnnotation]} />
                                    </ProgressBarComponent>
                                    <div className="absolute left-0 right-0 top-0 flex h-full items-center justify-center">
                                        <div className="text-center">
                                            <span className="text-2xl font-bold">{`${displayedProgress}%`}</span>
                                            <div className="text-sm text-gray-500">Complete</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
  );
};

export default GlobalProgressBar;
