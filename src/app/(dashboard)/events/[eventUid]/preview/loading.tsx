import ThreeCircleLoading from "@/components/animation/ThreeCircleLoading";

const LoadingPreviewPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ThreeCircleLoading message="waiting for event data" />
    </div>
  );
};

export default LoadingPreviewPage;
