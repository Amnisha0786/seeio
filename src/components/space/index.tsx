const Space = ({ size, horizontal }: { size: number, horizontal?: boolean }) => (
  <div style={{ [horizontal ? "width" : "height"]: `${size / 10}rem` }} />
)

export default Space
