
import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // SIMPLE TABLE CHECK (Decoupled from Supabase Auth)
            // We check the 'admin_users' table directly for a matching email/password pair.

            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', email)
                .eq('password', password) // Validating against stored text password as requested
                .single();

            if (error || !data) {
                throw new Error('Invalid Admin Credentials');
            }

            // Success! 
            // In a real production app, we would set a session token here.
            // For now, we trust the successful DB query for access.

            // Success! 
            await supabase.auth.signOut();
            localStorage.setItem('repairly_admin_session', JSON.stringify({
                id: data.id,
                email: data.email,
                timestamp: new Date().toISOString()
            }));

            navigate('/admin/dashboard');

        } catch (error) {
            alert('Login Failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-secondary">Admin Portal</h1>
                    <p className="text-slate-400 text-sm">Restricted Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-medium"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-medium"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Enter Console'}
                    </button>
                </form>
            </div>
        </div>
    );
}
