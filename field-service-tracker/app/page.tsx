'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Ticket = {
  id: string
  ticket_number: number
  customer_name: string
  service_type: string
  description: string
  status: string
  priority: string
  technician: string
  scheduled_date: string
  estimated_value: number
  created_at: string
}

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    service_type: 'HVAC',
    description: '',
    status: 'Open',
    priority: 'Medium',
    technician: '',
    scheduled_date: '',
    estimated_value: '',
  })

  useEffect(() => {
    fetchTickets()
  }, [])

  async function fetchTickets() {
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
    setTickets(data || [])
    setLoading(false)
  }

  async function saveTicket() {
    if (!form.customer_name || !form.description) {
      alert('Please fill in customer name and description')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('tickets').insert([{
      customer_name: form.customer_name,
      service_type: form.service_type,
      description: form.description,
      status: form.status,
      priority: form.priority,
      technician: form.technician,
      scheduled_date: form.scheduled_date || null,
      estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : null,
    }])
    if (error) {
      alert('Error saving ticket: ' + error.message)
    } else {
      setForm({
        customer_name: '',
        service_type: 'HVAC',
        description: '',
        status: 'Open',
        priority: 'Medium',
        technician: '',
        scheduled_date: '',
        estimated_value: '',
      })
      setShowForm(false)
      fetchTickets()
    }
    setSaving(false)
  }

  const statusColor: Record<string, string> = {
    'Open': '#378ADD',
    'In Progress': '#EF9F27',
    'Completed': '#639922',
    'Cancelled': '#888',
  }

  const priorityColor: Record<string, string> = {
    'Low': '#639922',
    'Medium': '#EF9F27',
    'High': '#E24B4A',
    'Urgent': '#A32D2D',
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto', background: '#f8f9fa', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', background: '#1a1a2e', padding: '16px 24px', borderRadius: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>⚡ FAST</h1>
          <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Field Access Service Tracker</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#378ADD', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
        >
          {showForm ? '✕ Cancel' : '+ New Ticket'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Tickets', value: tickets.length, color: '#378ADD' },
          { label: 'Open', value: tickets.filter(t => t.status === 'Open').length, color: '#378ADD' },
          { label: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: '#EF9F27' },
          { label: 'Completed', value: tickets.filter(t => t.status === 'Completed').length, color: '#639922' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#1a1a2e' }}>Create New Ticket</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Customer Name *</label>
              <input
                value={form.customer_name}
                onChange={e => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Enter customer name"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Service Type</label>
              <select
                value={form.service_type}
                onChange={e => setForm({ ...form, service_type: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>HVAC</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Appliance</option>
                <option>General Repair</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Technician</label>
              <input
                value={form.technician}
                onChange={e => setForm({ ...form, technician: e.target.value })}
                placeholder="Assigned technician"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Scheduled Date</label>
              <input
                type="date"
                value={form.scheduled_date}
                onChange={e => setForm({ ...form, scheduled_date: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Estimated Value ($)</label>
              <input
                type="number"
                value={form.estimated_value}
                onChange={e => setForm({ ...form, estimated_value: e.target.value })}
                placeholder="0.00"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the problem or service needed..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowForm(false)}
              style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={saveTicket}
              disabled={saving}
              style={{ background: '#378ADD', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
            >
              {saving ? 'Saving...' : 'Save Ticket'}
            </button>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>Service Tickets</h2>
          <span style={{ fontSize: '12px', color: '#888' }}>{tickets.length} total</span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎫</div>
            <div>No tickets yet — create your first one!</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Priority</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Technician</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#378ADD' }}>#{ticket.ticket_number}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{ticket.customer_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{ticket.service_type}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: statusColor[ticket.status] + '20', color: statusColor[ticket.status], padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '500' }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: priorityColor[ticket.priority] + '20', color: priorityColor[ticket.priority], padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '500' }}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{ticket.technician || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{ticket.estimated_value ? `$${ticket.estimated_value}` : '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{ticket.scheduled_date || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}