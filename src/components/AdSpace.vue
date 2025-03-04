<template>
  <!-- Container de publicidade -->
  <div class="ad-space">
    <div class="ad-placeholder">
      <i class="bi bi-badge-ad"></i>
      <p>{{ $t('adSpace.title') }}</p>
      <span class="ad-info">{{ $t('adSpace.description') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdSpace'
}
</script>

<style scoped>
/* Estilos para o espaço publicitário */
.ad-space {
  margin-top: 0.5rem;
}

.ad-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  border-radius: 12px;
  padding: 1.8rem;
  height: 150px;
  text-align: center;
  border: 1px dashed #444;
}

.ad-placeholder i {
  font-size: 2.5rem;
  color: #ff7e5f;
  margin-bottom: 0.8rem;
}

.ad-placeholder p {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
}

.ad-placeholder .ad-info {
  font-size: 0.8rem;
  color: #a0a0a0;
}

@media (max-width: 768px) {
  .ad-placeholder {
    height: 120px;
    padding: 1.2rem;
  }
}
</style>