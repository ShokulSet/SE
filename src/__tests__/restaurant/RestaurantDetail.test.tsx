import { render, screen } from '@testing-library/react'
import RestaurantDetail from '@/components/restaurant/RestaurantDetail'

const mockRestaurant = {
  _id: 'r1',
  name: 'The Golden Fork',
  description: 'A cozy restaurant serving Thai fusion cuisine.',
  address: '123 Main St',
  province: 'Bangkok',
  postalcode: '10110',
  tel: '02-000-0000',
  picture: '',
  opentime: '09:00',
  closetime: '22:00',
}

describe('RestaurantDetail', () => {
  it('renders restaurant name', () => {
    render(<RestaurantDetail restaurant={mockRestaurant} />)
    expect(screen.getByText('The Golden Fork')).toBeInTheDocument()
  })

  it('renders address and province', () => {
    render(<RestaurantDetail restaurant={mockRestaurant} />)
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument()
    expect(screen.getByText(/Bangkok/)).toBeInTheDocument()
  })

  it('renders opening hours', () => {
    render(<RestaurantDetail restaurant={mockRestaurant} />)
    expect(screen.getByText(/09:00/)).toBeInTheDocument()
    expect(screen.getByText(/22:00/)).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<RestaurantDetail restaurant={mockRestaurant} />)
    expect(screen.getByText(/cozy restaurant/)).toBeInTheDocument()
  })

  it('does not render image when picture is empty', () => {
    render(<RestaurantDetail restaurant={mockRestaurant} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders image when picture url is provided', () => {
    render(<RestaurantDetail restaurant={{ ...mockRestaurant, picture: 'https://example.com/img.jpg' }} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
