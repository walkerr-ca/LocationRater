package validators

type Query struct {
	Page     int32  `json:"page" validate:"required"`
	PageSize int32  `json:"pageSize" validate:"required"`
	Search   string `json:"search" validate:""`
}
