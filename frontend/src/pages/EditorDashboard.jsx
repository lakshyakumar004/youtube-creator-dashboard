import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Anchor,
  rem,
  Menu,
  Avatar,
  Divider
} from '@mantine/core';
import { IconLogout, IconUser, IconMail, IconSettings } from '@tabler/icons-react';
import axios from 'axios';

const EditorDashboard = () => {
  const [videos, setVideos] = useState([]);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/videos/to-edit', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Box style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Navbar */}
      <Box
        py="lg"
        px="xl"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title 
          order={2} 
          style={{ 
            background: 'linear-gradient(45deg, #43e97b, #38f9d7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700
          }}
        >
          ✂️ Editor Studio
        </Title>

        <Menu withArrow position="bottom-end" width={220} shadow="md">
          <Menu.Target>
            <Avatar color="green" radius="xl" style={{ cursor: 'pointer' }}>
              {username?.[0]?.toUpperCase() || 'E'}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item>
              <Text fw={600}>👤 {username || 'Editor'}</Text>
            </Menu.Item>
            <Menu.Item>
              <Text size="sm" c="dimmed">📧 {email || 'No email'}</Text>
            </Menu.Item>
            <Menu.Item>
              <Text size="sm" c="dimmed">🛠️ {role || 'user'}</Text>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" onClick={handleLogout}>
              🚪 Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>

      {/* Main */}
      <Container size="lg" my="xl" style={{ flex: 1 }}>
        <Stack spacing="xl" align="center">
          <Title 
            order={2} 
            align="center"
            style={{
              background: 'linear-gradient(45deg, #43e97b, #38f9d7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.25)'  // 👈 improves visibility
            }}
          >
            🛠️ Videos to Edit
          </Title>

          {videos.length === 0 ? (
            <Text size="md" style={{ color: '#065f46' }}>No videos available for editing.</Text>
          ) : (
            <Stack w="100%" maw={700} spacing="lg">
              {videos.map((vid) => (
                <Paper
                  key={vid._id}
                  shadow="md"
                  p="lg"
                  radius="lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <Group position="apart" mb="sm">
                    <Text fw={600} style={{ fontSize: rem(16), color: '#1f2937' }}>
                      🎬 {vid.originalName}
                    </Text>
                    <Text size="sm" style={{ color: '#4b5563' }}>
                      {new Date(vid.uploadedAt).toLocaleString()}
                    </Text>
                  </Group>
                  <Anchor
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontWeight: 600,
                      color: '#059669',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    ▶️ Watch Video
                  </Anchor>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>

      {/* Footer */}
      <Box py="lg" style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.95)' }}>
        <Text size="sm" style={{ color: '#065f46', fontWeight: 500 }}>
          © 2025 Editor Studio. Designed for perfection.
        </Text>
      </Box>
    </Box>
  );
};

export default EditorDashboard;
