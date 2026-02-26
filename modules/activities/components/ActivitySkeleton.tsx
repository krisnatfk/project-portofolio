import Skeleton from "react-loading-skeleton";
import Card from "@/common/components/elements/Card";
import SkeletonLoader from "@/common/components/elements/SkeletonLoader";

const ActivitySkeleton = () => {
    return (
        <SkeletonLoader>
            <Card className="overflow-hidden !p-0">
                <Skeleton
                    className="h-[200px] !rounded-b-none !rounded-t-xl"
                    containerClassName="block leading-none"
                />
                <div className="space-y-2 p-4">
                    <Skeleton count={2} />
                    <Skeleton width="60%" />
                    <div className="pt-2">
                        <Skeleton width="40%" />
                    </div>
                </div>
            </Card>
        </SkeletonLoader>
    );
};

export default ActivitySkeleton;
