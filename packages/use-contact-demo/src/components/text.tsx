import Box, { type BoxProps } from 'components/box'
import { cx } from 'cva'

export const LargeText: React.FC<BoxProps<'div'>> = ({
  className,
  as = 'div',
  ...rest
}) => (
  <Box
    {...rest}
    as={as}
    className={cx(
      'font-bold text-[32px] leading-9 my-0 tracking-[1px]',
      className
    )}
  />
)

export const Text: React.FC<BoxProps<'div'>> = ({
  className,
  as = 'div',
  ...rest
}) => (
  <Box
    {...rest}
    as={as}
    className={cx(
      'font-medium text-xl leading-6 my-0 tracking-[-0.25px]',
      className
    )}
  />
)
