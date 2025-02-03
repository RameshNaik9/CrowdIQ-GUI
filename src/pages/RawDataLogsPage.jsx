import Header from "../components/common/Header";
import RawDataTable from "../components/datalogs/RawDataTable";

const RawDataLogsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Raw Data Logs" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <RawDataTable />
      </main>
    </div>
  );
};

export default RawDataLogsPage;
