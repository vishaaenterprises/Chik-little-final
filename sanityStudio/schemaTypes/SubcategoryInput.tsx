import { useState, useEffect } from 'react'
import { useClient, useFormValue, set, unset } from 'sanity'

export function SubcategoryInput(props: any) {
  const { value, onChange, elementProps } = props

  const categoryRef = (useFormValue(['category']) as any)?._ref
  const client = useClient({ apiVersion: '2024-01-01' })
  const [options, setOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!categoryRef) {
      setOptions([])
      return
    }
    setLoading(true)
    client
      .fetch<{ subcategories?: string[] }>(
        `*[_type == "category" && _id == $id][0]{ subcategories }`,
        { id: categoryRef }
      )
      .then((cat) => setOptions(cat?.subcategories ?? []))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false))
  }, [categoryRef, client])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.currentTarget.value
    onChange(val ? set(val) : unset())
  }

  // ── Shared styles ──────────────────────────────────────────
  const messageStyle: React.CSSProperties = {
    fontSize: 13,
    margin: '6px 0',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid var(--card-border-color, #2a2a2a)',
    background: 'var(--card-bg-color, #1a1a1a)',
    color: 'var(--card-muted-fg-color, #888)',
  }

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid var(--card-border-color, #2a2a2a)',
    background: 'var(--card-bg-color, #1a1a1a)',
    color: 'var(--card-fg-color, #fff)',
    fontSize: 14,
    cursor: 'pointer',
    outline: 'none',
    appearance: 'auto',
  }

  if (!categoryRef) {
    return (
      <p style={messageStyle}>
        ⬆ Pehle category select karein, phir subcategory dikhayi degi.
      </p>
    )
  }

  if (loading) {
    return (
      <p style={messageStyle}>
        ⏳ Subcategories load ho rahi hain…
      </p>
    )
  }

  if (options.length === 0) {
    return (
      <p style={messageStyle}>
        ⚠ Is category mein koi subcategory nahi hai. Pehle category mein add karein.
      </p>
    )
  }

  return (
    <select
      {...elementProps}
      value={value ?? ''}
      onChange={handleChange}
      style={selectStyle}
    >
      <option value=''>— Subcategory chunein —</option>
      {options.map((sub) => (
        <option key={sub} value={sub}>
          {sub}
        </option>
      ))}
    </select>
  )
}