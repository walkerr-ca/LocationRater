package validators

type CreateReviewRequest struct {
	Longitude   float64 `json:"longitude" validate:"required"`
	Latitude    float64 `json:"latitude" validate:"required"`
	Title       string  `json:"title" validate:"required"`
	Description string  `json:"description" validate:"required"`
	Rating      int32   `json:"rating" validate:"required,min=1,max=5"`
}
