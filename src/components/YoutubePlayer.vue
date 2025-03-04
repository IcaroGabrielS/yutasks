<template>
  <div class="youtube-container">
    <!-- Container de vídeo principal -->
    <h4>{{ $t('youtube.title') }}</h4>
    <div class="video-container">
      <div class="video-wrapper" :style="{ paddingBottom: '56.25%' }">
        <iframe 
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0"
          :title="$t('youtube.videoInfo.title')"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </div>
    
    <div class="video-info">
      <div class="video-title">
        {{ $t('youtube.videoInfo.title') }}
      </div>
      <div class="video-channel">
        {{ $t('youtube.videoInfo.channel') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YoutubePlayer'
}
</script>

<style scoped>
.youtube-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

h4 {
  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

h4:before {
  content: '';
  display: block;
  width: 3px;
  height: 16px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.video-container {
  width: 100%;
  background-color: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.video-wrapper {
  width: 100%;
  position: relative;
  background-color: #000;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.video-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.5rem 0;
}

.video-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e0e0e0;
}

.video-channel {
  font-size: 0.85rem;
  color: #a0a0a0;
}

@media (max-width: 768px) {
  .video-wrapper {
    height: 0;
    padding-bottom: 56.25%; /* Aspect ratio 16:9 */
  }
}
</style>