export function setChartSync(selector) {
	const syncElements = document.querySelectorAll(selector)
	const syncCharts = Array.from(syncElements).map((e) => Highcharts.charts[e.dataset.highchartsChart])
	;['mousemove', 'touchmove', 'touchstart', 'mouseout'].forEach((eventType) => {
		syncElements.forEach((s, i) => {
			s.addEventListener(eventType, (e) => {
				syncCharts.forEach((chart) => {
					if (eventType === 'mouseout') {
						syncCharts.forEach((c) => {
							c.tooltip.hide()
						})
					} else {
						chart.pointer.reset = () => undefined
						const point = chart.series[0].searchPoint(chart.pointer.normalize(e), true)
						if (point) {
							point.onMouseOver()
						}
					}
				})
			})
		})
	})
}

export function syncExtremes(e) {
	if (e.trigger !== 'syncExtremes') {
		const sync_id = this.chart.container.parentElement.getAttribute('data-sync')
		if (sync_id) {
			const syncElements = document.querySelectorAll(`[data-sync="${sync_id}"]`)
			const syncCharts = Array.from(syncElements).map((c) => Highcharts.charts[c.dataset.highchartsChart])
			const thisChart = this.chart
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
