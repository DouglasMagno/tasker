import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TaskForm from '../components/TaskForm';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TaskForm Simple Integration (one-time tasks)', () => {
    const backendUrl = 'http://localhost:5000/api';
    const onTaskCreated = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('submits valid one-time task successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                id: '123',
                type: 'one-time',
                schedule: '2050-03-04T14:30:00',
                nextExecution: '2050-03-04T14:30:00',
                payload: { message: 'Valid Task' }
            }
        });

        render(<TaskForm onTaskCreated={onTaskCreated} backendUrl={backendUrl} />);

        const scheduleInput = screen.getByLabelText(/Schedule/i);
        fireEvent.change(scheduleInput, { target: { value: '2050-03-04T14:30:00' } });

        const payloadInput = screen.getByLabelText(/Payload/i);
        fireEvent.change(payloadInput, { target: { value: 'Valid Task' } });

        const submitButton = screen.getByRole('button', { name: /Create Task/i });
        fireEvent.click(submitButton);

        await waitFor(() => expect(onTaskCreated).toHaveBeenCalled());
    });

    test('displays error for invalid one-time datetime', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            isAxiosError: true,
            response: { data: { message: 'Invalid datetime format for one-time task.' } }
        });

        render(<TaskForm onTaskCreated={onTaskCreated} backendUrl={backendUrl} />);

        const scheduleInput = screen.getByLabelText(/Schedule/i);
        fireEvent.change(scheduleInput, { target: { value: 'invalid-date' } });

        const payloadInput = screen.getByLabelText(/Payload/i);
        fireEvent.change(payloadInput, { target: { value: 'Test Message' } });

        const submitButton = screen.getByRole('button', { name: /Create Task/i });
        fireEvent.click(submitButton);

        await waitFor(() =>
            expect(
                screen.getByText(/(Invalid datetime format for one-time task\.|An unexpected error occurred\.)/i)
            ).toBeInTheDocument()
        );
    });

    test('displays a generic error message on network error', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

        render(<TaskForm onTaskCreated={onTaskCreated} backendUrl={backendUrl} />);

        const scheduleInput = screen.getByLabelText(/Schedule/i);
        fireEvent.change(scheduleInput, { target: { value: '2050-03-04T14:30:00' } });

        const payloadInput = screen.getByLabelText(/Payload/i);
        fireEvent.change(payloadInput, { target: { value: 'Test Task' } });

        const submitButton = screen.getByRole('button', { name: /Create Task/i });
        fireEvent.click(submitButton);

        await waitFor(() =>
            expect(screen.getByText(/An unexpected error occurred\./i)).toBeInTheDocument()
        );
    });
});
