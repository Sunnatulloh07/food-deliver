import DashobardOverview from '../components/dashboard/DashobardOverview'
import DashobardData from '../components/dashboard/DashobardData'

export default function Home() {

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashobardOverview />
      <DashobardData />
    </div>
  );
}
