export function setChartSync(selector) {
	const syncElements = document.querySelectorAll(selector)
	const syncCharts = Array.from(syncElements).map((e) => Highcharts.charts[e.dataset.highchartsChart])
	;['mousemove', 'touchmove', 'touchstart', 'mouseout'].forEach((eventType) => {
		syncElements.forEach((s) => {
			s.addEventListener(eventType, (e) => {
				const currentChart = syncCharts.find((c) => c.renderTo.id === e.currentTarget.id)
				if (currentChart.hoverPoint) {
					syncCharts.forEach((chart) => {
						if (chart != currentChart) {
							if (eventType === 'mouseout') {
								syncCharts.forEach((c) => {
									c.tooltip.hide()
								})
							} else {
								chart.pointer.reset = () => undefined
								const point = chart.series[0].points.find((p) => p.x >= currentChart.hoverPoint.category)
								if (point) {
									point.onMouseOver()
								}
							}
						}
					})
				}
			})
		})
	})
}

export function syncExtremes(e) {
	if (e.trigger !== 'syncExtremes') {
		const thisChart = this.chart
		const sync_id = thisChart.container.parentElement.getAttribute('data-sync')
		if (sync_id) {
			const syncElements = document.querySelectorAll(`[data-sync="${sync_id}"]`)
			const syncCharts = Array.from(syncElements).map((c) => Highcharts.charts[c.dataset.highchartsChart])
			if (syncCharts.includes(thisChart)) {
				syncCharts.forEach((chart) => {
					if (chart !== thisChart) {
						if (chart.xAxis[0].setExtremes) {
							chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' })
						}
					}
				})
			}
		}
	}
}
