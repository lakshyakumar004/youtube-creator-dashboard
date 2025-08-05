import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  FileButton,
  Text,
  Paper,
  Badge,
  Loader,
  Stack,
  Divider,
  Anchor,
  Box,
  rem,
  Menu,
  Avatar,
  UnstyledButton,
  Select,
  Notification,
} from '@mantine/core';
import axios from 'axios';
import { IconCheck, IconX } from '@tabler/icons-react';

const CreatorDashboard = () => {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [editors, setEditors] = useState([]);
  const [assignStatus, setAssignStatus] = useState(null);
  const [selectedEditors, setSelectedEditors] = useState({});
  const [assignedMap, setAssignedMap] = useState({});

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
      const res = await axios.get('http://localhost:5000/api/videos/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data);

      // Populate assignedMap from video data
      const map = {};
      res.data.forEach((video) => {
        if (video.assignedEditors && video.assignedEditors.length > 0) {
          map[video._id] = video.assignedEditors[0]; // only first editor
        }
      });
      setAssignedMap(map);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const fetchEditors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/videos/editors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formatted = res.data.map((e) => ({
        label: e.name || e.email,
        value: e._id,
      }));
      setEditors(formatted);
    } catch (err) {
      console.error('Error fetching editors:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchEditors();
  }, []);

  const handleUpload = async () => {
    if (!video) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('video', video);

    try {
      await axios.post('http://localhost:5000/api/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Upload successful!');
      setVideo(null);
      fetchVideos();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const assignEditor = async (videoId) => {
    const editorId = selectedEditors[videoId];
    if (!editorId) {
      setAssignStatus({ status: false, message: 'Please select an editor' });
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/videos/${videoId}/assign-editor`,
        { editorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAssignStatus({ status: true, message: 'Editor assigned successfully' });
      setAssignedMap((prev) => ({ ...prev, [videoId]: editorId }));
      fetchVideos();
    } catch (err) {
      console.error('Assign error:', err);
      setAssignStatus({ status: false, message: 'Failed to assign editor' });
    }
  };

  return (
    <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Box
        component="nav"
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
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          🎬 Creator Studio
        </Title>

        <Menu shadow="md" width={220} position="bottom-end" offset={4}>
          <Menu.Target>
            <UnstyledButton>
              <Group spacing="sm">
                <Avatar color="indigo" radius="xl">
                  {username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item><Text fw={600}>👤 {username || 'Creator'}</Text></Menu.Item>
            <Menu.Item><Text size="sm" c="dimmed">📧 {email || 'No email'}</Text></Menu.Item>
            <Menu.Item><Text size="sm" c="dimmed">🛠️ {role || 'user'}</Text></Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" onClick={handleLogout}>🚪 Logout</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>

      {/* Main Content */}
      <Container size="lg" my="xl" style={{ flex: 1 }}>
        <Stack spacing="xl" align="center">
          <Paper shadow="xl" radius="xl" p="xl" w="100%" maw={700} style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
            <Title order={2} align="center" mb="lg" style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600 }}>📹 Upload New Video</Title>
            <Group position="center" mt="md" spacing="lg">
              <FileButton onChange={setVideo} accept="video/mp4">
                {(props) => (
                  <Button {...props} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} size="md" radius="xl" style={{ boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)', transition: 'all 0.3s ease' }}>📁 Select Video</Button>
                )}
              </FileButton>
              <Button onClick={handleUpload} disabled={!video || uploading} variant="gradient" gradient={{ from: 'teal', to: 'lime' }} size="md" radius="xl" style={{ boxShadow: video && !uploading ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none', transition: 'all 0.3s ease' }}>
                {uploading ? (<><Loader size="xs" color="white" mr="xs" />Uploading...</>) : 'Upload'}
              </Button>
            </Group>
            {video && <Text align="center" size="sm" mt="md" style={{ color: '#059669', fontWeight: 500, background: 'rgba(16, 185, 129, 0.1)', padding: rem(8), borderRadius: rem(8), border: '1px solid rgba(16, 185, 129, 0.2)' }}>✅ Selected: {video.name}</Text>}
          </Paper>

          <Stack w="100%" maw={700} spacing="lg">
            <Paper p="lg" radius="xl" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
              <Title order={3} style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600, marginBottom: rem(16) }}>📚 Your Video Library</Title>
              <Divider style={{ background: 'linear-gradient(90deg, transparent, #667eea, transparent)' }} />

              {videos.length === 0 ? (
                <Box style={{ textAlign: 'center', padding: rem(40), color: '#6b7280' }}>
                  <Text size="lg" mb="xs">📽️</Text>
                  <Text>No videos uploaded yet. Start creating!</Text>
                </Box>
              ) : (
                <Stack spacing="md" mt="lg">
                  {videos.map((vid) => (
                    <Paper key={vid._id} shadow="md" p="lg" radius="lg" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))', border: '1px solid rgba(255, 255, 255, 0.5)', transition: 'all 0.3s ease' }}>
                      <Group position="apart" mb="sm">
                        <Text fw={600} style={{ color: '#1f2937', fontSize: rem(16) }}>🎥 {vid.originalName}</Text>
                        <Badge variant="gradient" gradient={vid.status === 'pending' ? { from: 'yellow', to: 'orange' } : vid.status === 'edited' ? { from: 'blue', to: 'cyan' } : { from: 'teal', to: 'lime' }} size="md" style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                          {vid.status === 'pending' ? '⏳' : vid.status === 'edited' ? '✏️' : '✅'} {vid.status.toUpperCase()}
                        </Badge>
                      </Group>
                      <Text size="sm" style={{ color: '#6b7280', marginBottom: rem(12) }}>📅 Uploaded: {new Date(vid.uploadedAt).toLocaleString()}</Text>
                      <Anchor href={vid.url} target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600, textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}>▶️ Watch Video</Anchor>

                      {/* Assigned Editor */}
                      {assignedMap[vid._id] ? (
                        <Text mt="md" fw={500} style={{ color: '#2563eb' }}>
                          🎯 Editor assigned: {
                            editors.find((e) => e.value === assignedMap[vid._id])?.label || 'Unknown'
                          }
                        </Text>
                      ) : (
                        <Group mt="md">
                          <Select
                            placeholder="Assign editor"
                            data={editors}
                            value={selectedEditors[vid._id] || ''}
                            onChange={(value) =>
                              setSelectedEditors((prev) => ({ ...prev, [vid._id]: value }))
                            }
                            w="200px"
                          />
                          <Button size="xs" variant="light" onClick={() => assignEditor(vid._id)}>
                            Assign
                          </Button>
                        </Group>
                      )}
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
          </Stack>
        </Stack>
        {assignStatus && (
          <Notification
            icon={assignStatus.status ? <IconCheck size={18} /> : <IconX size={18} />}
            color={assignStatus.status ? 'teal' : 'red'}
            title={assignStatus.status ? 'Success' : 'Error'}
            mt="xl"
            onClose={() => setAssignStatus(null)}
          >
            {assignStatus.message}
          </Notification>
        )}
      </Container>

      <Box py="lg" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
        <Text size="sm" style={{ color: '#6b7280', fontWeight: 500 }}>© 2025 Creator Studio Platform. Crafted with ❤️ for creators.</Text>
      </Box>
    </Box>
  );
};

export default CreatorDashboard;
