export default function (newRefreshData: string) {
  const localStorageRefresh = localStorage.getItem("refresh")
	let refreshData = [];
	if (localStorageRefresh) {
		refreshData = JSON.parse(localStorageRefresh)
	}
	if (!refreshData.includes(newRefreshData)) {
		refreshData.push(newRefreshData)
	}
	localStorage.setItem('refresh', JSON.stringify(refreshData))
}