import React from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title,
  Select,
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

const Signup = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'creator',
    },
  });

const handleSubmit = async (values) => {
try {
    const res = await axios.post('http://localhost:5000/api/auth/signup', values);
    showNotification({
    title: 'Success',
    message: res.data.message,
    color: 'green',
    });
    navigate('/login');
} catch (err) {
    showNotification({
    title: 'Signup Failed',
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
      <Container size={450}>
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
              Sign Up
            </Title>
            <Text size="sm" style={{ color: '#6b7280' }}>
              Create an account
            </Text>
          </Box>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="lg">
              <TextInput
                label="Full Name"
                placeholder="e.g. Tony Stark"
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
                {...form.getInputProps('name')}
              />
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
                placeholder="Create a strong password"
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
              <Select
                label="Role"
                data={[
                  { value: 'creator', label: 'Creator' },
                  { value: 'editor', label: 'Editor' },
                ]}
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
                {...form.getInputProps('role')}
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
                Create an account
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
              Already have an account?{' '}
              <Link 
                to="/login" 
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
                Sign In Here
              </Link>
            </Text>
          </Box>
        </Paper>

        {/* Features Section */}
        <Box mt="xl" style={{ textAlign: 'center' }}>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;