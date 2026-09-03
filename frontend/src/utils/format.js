export const formatINR = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—'
  const num = Number(value)
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

export const formatPriceRange = (low, high) => {
  if (low === null || high === null || low === undefined || high === undefined) return '—'
  return `${formatINR(low)} – ${formatINR(high)}`
}

export const apiBaseWithoutApi = () => {
  const base = import.meta.env.VITE_API_BASE_URL || ''
  return base.replace(/\/api\/?$/, '')
}