

export default function ActivityDetailLoading() {
  return (
    <main className="page-content">
      <div className="h-[55vh] bg-brand-mid opacity-40 animate-pulse" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-6.5 w-3/5 rounded bg-grey-light opacity-30 animate-pulse" />
        <div className="h-4 w-[30%] rounded bg-grey-light opacity-20 animate-pulse" />
      </div>
    </main>
  );
}