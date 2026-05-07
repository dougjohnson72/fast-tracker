'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

type Customer = {
  id: string
  name: string
  type: string
  phone: string
  email: string
  street: string
  city: string
  state: string
  zip: string
  services: string
  notes: string
  created_at: string
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'Residential',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: 'AL',
    zip: '',
    services: '',
    notes: '',
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    setCustomers(data || [])
    setLoading(false)
  }

  async function saveCustomer() {
    if (!form.name || !form.phone) {
      alert('Please fill in customer name and phone')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('customers').insert([{
      name: form.name,
      type: form.type,
      phone: form.phone,
      email: form.email,
      street: form.street,
      city: form.city,
      state: form.state,
      zip: form.zip,
      services: form.services,
      notes: form.notes,
    }])
    if (error) {
      alert('Error saving customer: ' + error.message)
    } else {
      setForm({
        name: '',
        type: 'Residential',
        phone: '',
        email: '',
        street: '',
        city: '',
        state: 'AL',
        zip: '',
        services: '',
        notes: '',
      })
      setShowForm(false)
      fetchCustomers()
    }
    setSaving(false)
  }

  async function updateCustomer() {
    if (!selectedCustomer) return
    setSaving(true)
    const { error } = await supabase
      .from('customers')
      .update({
        name: selectedCustomer.name,
        type: selectedCustomer.type,
        phone: selectedCustomer.phone,
        email: selectedCustomer.email,
        street: selectedCustomer.street,
        city: selectedCustomer.city,
        state: selectedCustomer.state,
        zip: selectedCustomer.zip,
        services: selectedCustomer.services,
        notes: selectedCustomer.notes,
      })
      .eq('id', selectedCustomer.id)
    if (error) {
      alert('Error updating customer: ' + error.message)
    } else {
      setSelectedCustomer(null)
      fetchCustomers()
    }
    setSaving(false)
  }

  async function deleteCustomer() {
    if (!selectedCustomer) return
    if (!confirm('Are you sure you want to delete this customer?')) return
    setDeleting(true)
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', selectedCustomer.id)
    if (error) {
      alert('Error deleting customer: ' + error.message)
    } else {
      setSelectedCustomer(null)
      fetchCustomers()
    }
    setDeleting(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '13px',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontSize: '12px',
    color: '#666',
    display: 'block',
    marginBottom: '4px',
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', background: '#1a1a2e', padding: '16px 24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>← Back to Dashboard</Link>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>⚡ FAST</h1>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Customer Management</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setSelectedCustomer(null) }}
          style={{ background: '#378ADD', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
        >
          {showForm ? '✕ Cancel' : '+ New Customer'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Customers', value: customers.length, color: '#378ADD' },
          { label: 'Residential', value: customers.filter(c => c.type === 'Residential').length, color: '#639922' },
          { label: 'Commercial', value: customers.filter(c => c.type === 'Commercial').length, color: '#EF9F27' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* New Customer Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#1a1a2e' }}>Add New Customer</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name / Business Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Customer Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Property Management</option>
                <option>Industrial</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(555) 000-0000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Street Address</label>
              <input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} placeholder="123 Main Street" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Birmingham" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} style={inputStyle}>
                <option>AL</option><option>AK</option><option>AZ</option><option>AR</option>
                <option>CA</option><option>CO</option><option>CT</option><option>FL</option>
                <option>GA</option><option>ID</option><option>IL</option><option>IN</option>
                <option>KY</option><option>LA</option><option>MD</option><option>MI</option>
                <option>MN</option><option>MS</option><option>MO</option><option>NC</option>
                <option>NJ</option><option>NY</option><option>OH</option><option>OK</option>
                <option>OR</option><option>PA</option><option>SC</option><option>TN</option>
                <option>TX</option><option>VA</option><option>WA</option><option>WI</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>ZIP Code</label>
              <input value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} placeholder="35201" maxLength={5} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Service Categories</label>
              <input value={form.services} onChange={e => setForm({ ...form, services: e.target.value })} placeholder="HVAC, Plumbing, Electrical..." style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Access codes, special instructions..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={saveCustomer} disabled={saving} style={{ background: '#378ADD', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>{saving ? 'Saving...' : 'Save Customer'}</button>
          </div>
        </div>
      )}

      {/* Edit Customer Panel */}
      {selectedCustomer && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #378ADD' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>Edit Customer</h2>
            <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name / Business Name</label>
              <input value={selectedCustomer.name} onChange={e => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Customer Type</label>
              <select value={selectedCustomer.type} onChange={e => setSelectedCustomer({ ...selectedCustomer, type: e.target.value })} style={inputStyle}>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Property Management</option>
                <option>Industrial</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={selectedCustomer.phone || ''} onChange={e => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={selectedCustomer.email || ''} onChange={e => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Street Address</label>
              <input value={selectedCustomer.street || ''} onChange={e => setSelectedCustomer({ ...selectedCustomer, street: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input value={selectedCustomer.city || ''} onChange={e => setSelectedCustomer({ ...selectedCustomer, city: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <select value={selectedCustomer.state || 'AL'} onChange={e => setSelectedCustomer({ ...selectedCustomer, state: e.target.value })} style={inputStyle}>
                <option>AL</option><option>AK</option><option>AZ</option><option>AR</option>
                <option>CA</option><option>CO</option><option>CT</option><option>FL</option>
                <option>GA</option><option>ID</option><option>IL</option><option>IN</option>
                <option>KY</option><option>LA</option><option>MD</option><option>MI</option>
                <option>MN</option><option>MS</option><option>MO</option><option>NC</option>
                <option>NJ</option><option>NY</option><option>OH</option><option>OK</option>
                <option>OR</option><option>PA</option><option>SC</option><option>TN</option>
                <option>TX</option><option>VA</option><option>WA</option><option>WI</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>ZIP Code</label>
              <input value={selectedCustomer.zip || ''} onChange={e => setSelectedCustomer({ ...selectedCustomer, zip: e.target.value })} maxLength={5} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Service Categories</label>
              <input value={selectedCustomer.services || ''} onChange={e => setSelectedCustomer({ ...selectedCustomer, services: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={selectedCustomer.notes || ''} onChange={e => setSelectedCustomer({ ...selectedCustomer, notes: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'space-between' }}>
            <button onClick={deleteCustomer} disabled={deleting} style={{ background: '#fff', color: '#E24B4A', border: '1px solid #E24B4A', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer' }}>{deleting ? 'Deleting...' : '🗑 Delete Customer'}</button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={updateCustomer} disabled={saving} style={{ background: '#378ADD', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>{saving ? 'Saving...' : 'Update Customer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Customers List */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>All Customers</h2>
          <span style={{ fontSize: '12px', color: '#888' }}>{customers.length} total</span>
        </div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading customers...</div>
        ) : customers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
            <div>No customers yet — add your first one!</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>City</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Services</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => { setSelectedCustomer(customer); setShowForm(false) }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#1a1a2e' }}>{customer.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: customer.type === 'Residential' ? '#E6F1FB' : '#FAEEDA', color: customer.type === 'Residential' ? '#0C447C' : '#633806', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '500' }}>
                      {customer.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{customer.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{customer.email || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{customer.city || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{customer.services || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#378ADD' }}>✏️</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}