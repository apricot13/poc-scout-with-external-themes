export const orderFilters = (filters, filterOrder) => {
  // ensure its sorted by order
  filterOrder.sort((a, b) => (a.order > b.order ? 1 : -1))

  const output = []

  // build the filter tree in order
  filterOrder.map(filter => {
    switch (filter.name) {
      case "send-needs":
        output.push(filters.sendNeeds.component)
        break
      case "ages":
        output.push(filters.ages.component)
        break
      case "accessibility":
        output.push(filters.accessibility.component)
        break
      case "only-show":
        output.push(filters.onlyShow.component)
        break
      case "days":
        output.push(filters.days.component)
        break
      default:
        return false
    }
    return false
  })

  return output
}
