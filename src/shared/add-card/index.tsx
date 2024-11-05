import Card from '@/components/card'
import Clickable from '@/components/clickable'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import AddButton from '@/components/add-button'

interface IProps {
  onClick?: () => void
  title: string
}

const AddCard = ({
  onClick,
  title
}: IProps): JSX.Element => {
  return (
    <Clickable onClick={onClick}>
      <Card paddingHorizontal={24} paddingVertical={22}>
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography size="huge">{title}</Typography>
          <AddButton />
        </FlexBox>
      </Card>
    </Clickable>
  )
}

export default AddCard
