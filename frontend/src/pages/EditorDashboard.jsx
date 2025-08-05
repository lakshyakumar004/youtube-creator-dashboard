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
  Divider,
  FileInput,
  Notification,
  Select,
  Badge,
  Loader,
  UnstyledButton,
} from '@mantine/core';
import axios from 'axios';
import { IconCheck, IconX, IconUser, IconCalendar, IconUpload } from '@tabler/icons-react';

const EditorDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [creatorId, setCreatorId] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [creators, setCreators] = useState([]);
  const [uploading, setUploading] = useState(false);

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
      const res = await axios.get('http://localhost:5000/api/videos/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const fetchCreators = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/videos/creators', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreators(
        res.data.map((creator) => ({
          value: creator._id,
          label: creator.name || creator.email,
        }))
      );
    } catch (err) {
      console.error('Error fetching creators:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchCreators();
  }, []);

  const handleUpload = async () => {
    if (!uploadFile || !creatorId) {
      setUploadSuccess({ status: false, message: 'Please provide both file and creator name' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('video', uploadFile);
    formData.append('creatorId', creatorId);

    try {
      await axios.post('http://localhost:5000/api/videos/upload-for-creator', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadSuccess({ status: true, message: 'Video uploaded successfully!' });
      setUploadFile(null);
      setCreatorId('');
      fetchVideos();
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadSuccess({ status: false, message: 'Upload failed. Try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
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
          ✂️ Editor Studio
        </Title>

        <Menu shadow="md" width={220} position="bottom-end" offset={4}>
          <Menu.Target>
            <UnstyledButton>
              <Group spacing="sm">
                <Avatar color="indigo" radius="xl">
                  {username?.[0]?.toUpperCase() || 'E'}
                </Avatar>
              </Group>
            </UnstyledButton>
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

      {/* Main Content */}
      <Container size="lg" my="xl" style={{ flex: 1 }}>
        <Stack spacing="xl" align="center">
          {/* Videos to Edit Section */}
          <Stack w="100%" maw={700} spacing="lg">
            <Paper 
              p="lg" 
              radius="xl" 
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(20px)', 
                border: '1px solid rgba(255, 255, 255, 0.3)', 
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <Title 
                order={3} 
                style={{ 
                  background: 'linear-gradient(45deg, #667eea, #764ba2)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent', 
                  fontWeight: 600, 
                  marginBottom: rem(16) 
                }}
              >
                🎬 Videos to Edit
              </Title>
              <Divider style={{ background: 'linear-gradient(90deg, transparent, #667eea, transparent)' }} />

              {videos.length === 0 && (
                <Box style={{ textAlign: 'center', padding: rem(40), color: '#6b7280' }}>
                  <Text size="lg" mb="xs">🎥</Text>
                  <Text>No videos available for editing.</Text>
                </Box>
              )}

              <Stack spacing="md" mt="lg">
                {videos.map((vid) => (
                  <Paper 
                    key={vid._id} 
                    shadow="md" 
                    p="lg" 
                    radius="lg" 
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))', 
                      border: '1px solid rgba(255, 255, 255, 0.5)', 
                      transition: 'all 0.3s ease', 
                      cursor: 'pointer' 
                    }} 
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.transform = 'translateY(-2px)'; 
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)'; 
                    }} 
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.transform = 'translateY(0)'; 
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'; 
                    }}
                  >
                    <Group position="apart" mb="sm">
                      <Text fw={600} style={{ color: '#1f2937', fontSize: rem(16) }}>
                        🎬 {vid.originalName}
                      </Text>
                      <Badge 
                        variant="gradient" 
                        gradient={{ from: 'yellow', to: 'orange' }} 
                        size="md" 
                        style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
                      >
                        ⏳ PENDING
                      </Badge>
                    </Group>

                    {vid.uploadedBy && (
                      <Text size="sm" style={{ color: '#6b7280', marginBottom: rem(8) }}>
                        👤 Creator: {vid.uploadedBy.name || vid.uploadedBy.email || 'Unknown'}
                      </Text>
                    )}

                    <Text size="sm" style={{ color: '#6b7280', marginBottom: rem(12) }}>
                      📅 Uploaded: {new Date(vid.uploadedAt).toLocaleString()}
                    </Text>

                    <Anchor 
                      href={vid.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
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
                      ▶️ Watch Video
                    </Anchor>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Stack>

          {/* Upload Edited Video Section */}
          <Paper 
            shadow="xl" 
            radius="xl" 
            p="xl" 
            w="100%" 
            maw={700} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(20px)', 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' 
            }}
          >
            <Title 
              order={2} 
              align="center" 
              mb="lg" 
              style={{ 
                background: 'linear-gradient(45deg, #667eea, #764ba2)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                fontWeight: 600 
              }}
            >
              ☁️ Upload Edited Video
            </Title>

            <Stack spacing="lg">
              <FileInput
                label={<Text fw={600} style={{ color: '#374151' }}>Select Video File</Text>}
                placeholder="Choose your edited .mp4 file"
                accept="video/mp4"
                value={uploadFile}
                onChange={setUploadFile}
                required
                size="md"
                radius="md"
                style={{
                  '& .mantine-FileInput-input': {
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }
                }}
              />

              <Select
                label={<Text fw={600} style={{ color: '#374151' }}>Select Creator</Text>}
                placeholder="Choose the content creator"
                data={creators}
                value={creatorId}
                onChange={setCreatorId}
                searchable
                nothingFound="No creators found"
                required
                size="md"
                radius="md"
                style={{
                  '& .mantine-Select-input': {
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }
                }}
              />

              {uploadFile && (
                <Text 
                  align="center" 
                  size="sm" 
                  style={{ 
                    color: '#059669', 
                    fontWeight: 500, 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    padding: rem(8), 
                    borderRadius: rem(8), 
                    border: '1px solid rgba(16, 185, 129, 0.2)' 
                  }}
                >
                  ✅ Selected: {uploadFile.name}
                </Text>
              )}

              <Group position="center" mt="md">
                <Button 
                  onClick={handleUpload} 
                  disabled={!uploadFile || !creatorId || uploading} 
                  variant="gradient" 
                  gradient={{ from: 'teal', to: 'lime' }} 
                  size="md" 
                  radius="xl" 
                  style={{ 
                    boxShadow: uploadFile && creatorId && !uploading ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none', 
                    transition: 'all 0.3s ease' 
                  }}
                >
                  {uploading ? (
                    <>
                      <Loader size="xs" color="white" mr="xs" />
                      Uploading...
                    </>
                  ) : (
                    '⬆️ Upload Edited Video'
                  )}
                </Button>
              </Group>

              {uploadSuccess && (
                <Notification
                  icon={uploadSuccess.status ? <IconCheck size={18} /> : <IconX size={18} />}
                  color={uploadSuccess.status ? 'teal' : 'red'}
                  title={uploadSuccess.status ? 'Success!' : 'Error'}
                  onClose={() => setUploadSuccess(null)}
                  radius="md"
                  style={{
                    background: uploadSuccess.status 
                      ? 'rgba(20, 184, 166, 0.1)' 
                      : 'rgba(239, 68, 68, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${uploadSuccess.status 
                      ? 'rgba(20, 184, 166, 0.3)' 
                      : 'rgba(239, 68, 68, 0.3)'}`
                  }}
                >
                  {uploadSuccess.message}
                </Notification>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>

      {/* Footer */}
      <Box 
        py="lg" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)', 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
          textAlign: 'center' 
        }}
      >
        <Text size="sm" style={{ color: '#6b7280', fontWeight: 500 }}>
          © 2025 Editor Studio Platform. Crafted with ❤️ for editors.
        </Text>
      </Box>
    </Box>
  );
};

export default EditorDashboard;