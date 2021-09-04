export interface plant {
  latin_name: String,
  common_name: String,
  description?: String,
  created: Date,
  lastUpdated: Date,
  price_per_oz?: Number,
  seeds_per_oz?: Number,
  germination?: String,
  lifecyle?: lifecycle,
  light?: [light],
  soil_moisture?: [moisture],
  height?: number | { min: Number, max: Number},
  space?: number | { min: Number, max: Number},
  bloom_months?: [month],
  flower_color?: [flowerColor],
  features?: [String],
  zones?: [zone],
}

type lifecycle = "Annual" | "Perennial" | "Biennial"
type soil = "Sand" | "Loam" | "Clay"
type light = "Full" | "Partial" | "Shade"
type moisture = "Wet" | "Medium-Wet" | "Medium" | "Medium-Dry" | "Dry"
type zone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type flowerColor = "White" | "Pink" | "Yellow" | "Orange" | "Red" | "Blue" | "Brown" | "Green" | "Purple"
type month ="January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December"
type features = "Polilinator Benefits" | "Deer Resistant" | "Lanscaping Friendly"