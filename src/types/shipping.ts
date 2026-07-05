export interface ShippingMethod {
    id: string
    title: string
    code: string
    description: string | null

    image: string | null

    estimated_days: string | null

    price: number

    cod: boolean

    active: boolean

    sort_order: number

    min_boxes: number

    max_boxes: number
}
