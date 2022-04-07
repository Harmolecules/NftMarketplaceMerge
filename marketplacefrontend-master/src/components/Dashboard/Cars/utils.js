export const getFitlerList = (cars) => {
  if (!cars || cars?.length === 0)
    return [
      {
        label: "All",
        value: "all",
      },
    ]
  return cars.reduce(
    (sum, car) => {
      if (sum.find((item) => item.value === car.classCurrent)) {
        return sum
      }
      return [...sum, { value: car.classCurrent, label: car.classCurrent }]
    },
    [
      {
        label: "All",
        value: "all",
      },
    ]
  )
}

export const getOrderedList = ({ carType, sorts, list = [] }) => {
  let newArr = []
  if (!list) return newArr

  if (carType === "all") {
    newArr = [...list]
  } else {
    newArr = list.filter((car) => car.classCurrent === carType)
  }

  if (sorts.length > 0) {
    const { key, direction } = sorts[0]
    if (direction === "asc") {
      newArr = newArr.sort((a, b) => a[key] - b[key])
    } else {
      newArr = newArr.sort((a, b) => b[key] - a[key])
    }
  }

  return newArr
}

export const getSortedItems = (items, sort) => {
  const { key, direction = "asc" } = sort
  if (direction === "asc") {
    return items.slice().sort((a, b) => {
      if (a[key] < b[key]) {
        return -1
      }
      if (a[key] > b[key]) {
        return 1
      }
      return 0
    })
  }
  return items.slice().sort((a, b) => {
    if (a[key] > b[key]) {
      return -1
    }
    if (a[key] < b[key]) {
      return 1
    }
    return 0
  })
}
