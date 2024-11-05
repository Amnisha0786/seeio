import React, { useMemo, Suspense } from 'react'

interface IProps {
  className?: string
  name: string
  size?: number
  rotate?: number
  alt?: string
  color?: string
  height?: number
}

const loadSVG = (fileName: string) => React.lazy(async () => {
  let moduleComp;
  try {
    moduleComp = await import(`../../../public/icons/${fileName}.svg`);
  } catch (e) {
    moduleComp = await import(`../../../public/icons/circle-regular.svg`);
  }
  return typeof moduleComp.default === "function" ? moduleComp : moduleComp.default;
});

const Icon = ({
  className,
  name,
  size = 24,
  alt,
  rotate = 0,
  color,
  height
}: IProps) => {
  const SvgComponent = useMemo(() => loadSVG(name), [name]);

  return (
    <Suspense fallback={<div style={{ width: size, height: height ? height : size }} />}>
      <SvgComponent
        className={className}
        alt={alt || "icon"}
        width={size}
        height={height ? height : size}
        fill={color}
        style={{
          transform: `rotate(${rotate}deg)`
        }}
      />
    </Suspense>
  )
}

export default Icon
