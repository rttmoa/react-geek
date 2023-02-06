import React from 'react'
import classNames from 'classnames'

type Props = {
  // type: 'icon' | 'iconString' | 'iconNumber'  // 指定类型 - 选择时会提示 只选择哪个属性
  type: string
  className?: string
  onClick?: () => void
}
function Icon({ type, className, ...rest }: Props) {
  return (
    <svg {...rest} className={classNames('icon', className)} aria-hidden="true">
      <use xlinkHref={`#${type}`}></use>
    </svg>
  )
}
// Icon.propTypes = {
//   type: PropTypes.string.isRequired  // type Props 中的type替代了这个 type
// }

export default Icon
