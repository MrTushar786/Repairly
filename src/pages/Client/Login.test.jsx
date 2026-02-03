import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClientLogin from './Login';
import { supabase } from '../../supabase';

// Mock Supabase
vi.mock('../../supabase', () => ({
    supabase: {
        auth: {
            getUser: vi.fn(),
            signInWithPassword: vi.fn(),
            signInWithOAuth: vi.fn(),
        },
        from: vi.fn(),
    },
}));

// Mock Sonner Toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    }
}));

import { toast } from 'sonner';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

// Helper to mock the fluent chain for checking user existence
const mockUserCheck = (exists) => {
    const singleMock = vi.fn().mockResolvedValue({
        data: exists ? { id: '123' } : null,
        error: exists ? null : { message: 'Not found' }
    });

    const eqMock = vi.fn(() => ({ single: singleMock }));
    const selectMock = vi.fn(() => ({ eq: eqMock }));

    supabase.from.mockReturnValue({ select: selectMock });

    return { singleMock };
};

describe('ClientLogin Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    });

    it('blocks login if user does not exist in public.users', async () => {
        mockUserCheck(false); // User does NOT exist

        render(
            <BrowserRouter>
                <ClientLogin />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'ghost@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });

        const signInBtn = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(signInBtn);

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('users');
            expect(toast.error).toHaveBeenCalledWith('No account found. Please create a new account to continue.');
            expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
        });
    });

    it('proceeds to login if user exists', async () => {
        mockUserCheck(true); // User EXISTS
        supabase.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });

        render(
            <BrowserRouter>
                <ClientLogin />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'real@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });

        const signInBtn = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(signInBtn);

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('users');
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'real@example.com',
                password: 'password123'
            });
            expect(mockedNavigate).toHaveBeenCalledWith('/client/dashboard');
        });
    });
});
