
export const getChartData = ({
  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  data = [2, 10, 4, 19, 13, 15, 12, 3, 9],
  label = "Sales",
  backgroundColor = 'rgba(75, 192, 192, 0.2)',
  borderColor = 'rgba(75, 192, 192, 1)'
}) => {
  return ({
    labels: labels,
    datasets: [
      {
        label: label,
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 4,
      },
    ],
  })
};
