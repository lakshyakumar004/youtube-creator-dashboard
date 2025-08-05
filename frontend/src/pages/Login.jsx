import React from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title,
  Paper,
  Text,
  Stack,
  Box,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';

const Login = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate(); // ✅ redirect hook

const handleLogin = async (values) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', values);
    showNotification({
      title: 'Welcome!',
      message: `Hello, ${res.data.user.name}`,
      color: 'green',
    });

    localStorage.setItem('username', res.data.user.name);
    localStorage.setItem('email', res.data.user.email);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.user.role);

    if (res.data.user.role === 'creator') {
      navigate('/creator-dashboard');
    } else {
      navigate('/editor-dashboard');
    }
  } catch (err) {
    showNotification({
      title: 'Login Failed',
      message: err.response?.data?.message || 'Something went wrong',
      color: 'red',
    });
  }
};

  return (
    <Box style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container size={420}>
        {/* Logo/Brand Section */}
        <Box mb="xl" style={{ textAlign: 'center' }}>
          <Box
            style={{
              fontSize: rem(48),
              marginBottom: rem(16),
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}
          >
            🎬
          </Box>
          <Title 
            order={1}
            style={{
              color: 'white',
              fontWeight: 700,
              fontSize: rem(32),
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              marginBottom: rem(8)
            }}
          >
            YT Creator
          </Title>
          <Text
            size="lg"
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            Welcome Back
          </Text>
        </Box>

        <Paper 
          shadow="xl" 
          p="xl" 
          radius="xl"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Box mb="lg" style={{ textAlign: 'center' }}>
            <Title 
              order={3}
              style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                marginBottom: rem(4)
              }}
            >
              Sign In to Continue
            </Title>
          </Box>

          <form onSubmit={form.onSubmit(handleLogin)}>
            <Stack spacing="lg">
              <TextInput
                label="Email Address"
                placeholder="creator@example.com"
                required
                size="md"
                radius="md"
                styles={{
                  label: {
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: rem(8)
                  },
                  input: {
                    border: '2px solid #e5e7eb',
                    '&:focus': {
                      borderColor: '#667eea',
                      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }
                  }
                }}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                size="md"
                radius="md"
                styles={{
                  label: {
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: rem(8)
                  },
                  input: {
                    border: '2px solid #e5e7eb',
                    '&:focus': {
                      borderColor: '#667eea',
                      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }
                  }
                }}
                {...form.getInputProps('password')}
              />
              <Button 
                type="submit" 
                fullWidth 
                size="md"
                radius="md"
                variant="gradient"
                gradient={{ from: '#667eea', to: '#764ba2' }}
                style={{
                  marginTop: rem(8),
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  fontWeight: 600,
                  fontSize: rem(16)
                }}
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Box
            mt="xl"
            pt="lg"
            style={{
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}
          >
            <Text size="sm" style={{ color: '#6b7280' }}>
              New to YT Creator?{' '}
              <Link 
                to="/signup" 
                style={{ 
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Create an account
              </Link>
            </Text>
          </Box>
        </Paper>

        {/* Additional Info */}
        <Box mt="xl" style={{ textAlign: 'center' }}>
          <Text
            size="sm"
            style={{
              color: 'rgba(255,255,255,0.8)',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            ✨ Upload & Manage Your YouTube Content
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;