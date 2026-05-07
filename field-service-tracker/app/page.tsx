'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [tickets, setTickets] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: ticketData } = await supabase.from('tickets').select('*').order('created_at', { ascending: false })
    const { data: customerData } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
    setTickets(ticketData || [])
    setCustomers(customerData || [])
    setLoading(false)
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '20px' }}>
        Field Service Tracker
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '30px' }}>
        <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Tickets</div>
          <div style={{ fontSize: '28px', fontWeight: '500' }}>{tickets.length}</div>
        </div>
        <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Open Tickets</div>
          <div style={{ fontSize: '28px', fontWeight: '500' }}>{tickets.filter(t => t.status === 'Open').length}</div>
        </div>
        <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Customers</div>
          <div style={{ fontSize: '28px', fontWeight: '500' }}>{customers.length}</div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>Recent Tickets</h2>
          {tickets.length === 0 ? (
            <p style={{ color: '#666' }}>No tickets yet. Let's add some!</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', fontSize: '12px', color: '#666' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Ticket #</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Priority</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>#{ticket.ticket_number}</td>
                    <td style={{ padding: '10px' }}>{ticket.customer_name}</td>
                    <td style={{ padding: '10px' }}>{ticket.service_type}</td>
                    <td style={{ padding: '10px' }}>{ticket.status}</td>
                    <td style={{ padding: '10px' }}>{ticket.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  )
}