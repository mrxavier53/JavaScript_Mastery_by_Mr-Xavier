/* JavaScript Mastery by Xavier — browser text-to-speech reader.
   Uses the browser/device Speech Synthesis API. No audio files or account are required. */
(function () {
  const PREFS_KEY = 'jsMasteryXavierReaderPrefs_v1';
  let voices = [];
  let readingSession = 0;

  function supported() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  function getPrefs() {
    try {
      return { voice: '', rate: '1', skipCode: true, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') };
    } catch {
      return { voice: '', rate: '1', skipCode: true };
    }
  }

  function savePrefs() {
    const voice = document.getElementById('speechVoice');
    const rate = document.getElementById('speechRate');
    const skipCode = document.getElementById('skipCode');
    if (!voice || !rate || !skipCode) return;
    localStorage.setItem(PREFS_KEY, JSON.stringify({ voice: voice.value, rate: rate.value, skipCode: skipCode.checked }));
  }

  function setStatus(message, kind) {
    const status = document.getElementById('readerStatus');
    if (!status) return;
    status.textContent = message;
    status.className = `reader-status${kind ? ` ${kind}` : ''}`;
  }

  function updateButtons() {
    const read = document.getElementById('readLesson');
    const pause = document.getElementById('pauseLesson');
    const stop = document.getElementById('stopLesson');
    if (!read || !pause || !stop || !supported()) return;
    const speaking = window.speechSynthesis.speaking;
    const paused = window.speechSynthesis.paused;
    read.textContent = paused ? '▶ Resume' : '▶ Read lesson';
    pause.disabled = !speaking || paused;
    stop.disabled = !speaking && !paused;
  }

  function loadVoices() {
    if (!supported()) return;
    voices = window.speechSynthesis.getVoices().slice().sort((a, b) => {
      const byLanguage = a.lang.localeCompare(b.lang);
      return byLanguage || a.name.localeCompare(b.name);
    });
    const select = document.getElementById('speechVoice');
    if (!select) return;
    const oldValue = select.value || getPrefs().voice;
    select.innerHTML = '<option value="">System default voice</option>' + voices.map((voice, index) => {
      const safeName = String(voice.name).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      const safeLang = String(voice.lang).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      return `<option value="${index}">${safeName} — ${safeLang}</option>`;
    }).join('');
    if (oldValue !== '' && voices[Number(oldValue)]) select.value = oldValue;
  }

  function codeForSpeech(code) {
    return code
      .replace(/\/\//g, ' comment ')
      .replace(/===/g, ' equals exactly ')
      .replace(/==/g, ' equals ')
      .replace(/=>/g, ' arrow ')
      .replace(/[{}()[\];]/g, ' ')
      .replace(/\n/g, '. ')
      .replace(/`/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buildLessonText(chapter) {
    const skipCode = document.getElementById('skipCode')?.checked ?? true;
    const bits = [
      `Chapter ${chapter.id}. ${chapter.title}.`,
      chapter.summary,
      'What you will learn.',
      ...chapter.learn,
    ];
    if (skipCode) {
      bits.push('There is a code example in this lesson. Code reading is turned off in the reader settings.');
    } else {
      bits.push('Code example.', codeForSpeech(chapter.example));
    }
    bits.push(
      'Remember. Programming becomes easier when you test small changes. Read code line by line, predict the output, and then run it in your browser console or a JavaScript file.',
      'Mini challenge. Make a small version of the example using your own names and values. Then open the Tasks page to complete this chapter’s challenges.'
    );
    return bits.join(' ');
  }

  function readChapter(chapter) {
    if (!supported()) {
      setStatus('Read aloud is not supported by this browser or device.', 'error');
      return;
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStatus('Reading resumed.', 'playing');
      updateButtons();
      return;
    }

    const session = ++readingSession;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(buildLessonText(chapter));
    const voiceSelect = document.getElementById('speechVoice');
    const speedSelect = document.getElementById('speechRate');
    const selectedVoice = voices[Number(voiceSelect?.value)];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = Number(speedSelect?.value || 1);
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => {
      if (session !== readingSession) return;
      setStatus('Reading this lesson…', 'playing');
      updateButtons();
    };
    utterance.onend = () => {
      if (session !== readingSession) return;
      setStatus('Finished reading this lesson.', 'done');
      updateButtons();
    };
    utterance.onerror = event => {
      if (session !== readingSession || event.error === 'canceled' || event.error === 'interrupted') return;
      setStatus('The reader could not start. Try another voice or browser.', 'error');
      updateButtons();
    };
    window.speechSynthesis.speak(utterance);
  }

  function pauseReader() {
    if (!supported() || !window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    setStatus('Reading paused.', 'paused');
    updateButtons();
  }

  function stopReader() {
    if (!supported()) return;
    readingSession += 1;
    window.speechSynthesis.cancel();
    setStatus('Reader stopped.', '');
    updateButtons();
  }

  window.renderReadAloudControls = function (chapter) {
    const prefs = getPrefs();
    const supportedReader = supported();
    const controls = document.getElementById('readAloudControls');
    if (!controls) return;
    controls.innerHTML = `
      <div class="reader-heading">
        <div><span class="reader-icon" aria-hidden="true">🔊</span><div><strong>Read aloud</strong><p>Listen to this chapter with your device’s available voice.</p></div></div>
        <span id="readerStatus" class="reader-status">${supportedReader ? 'Ready to read.' : 'Not supported on this browser.'}</span>
      </div>
      <div class="reader-options">
        <label>Voice<select id="speechVoice" aria-label="Choose reading voice"><option value="">System default voice</option></select></label>
        <label>Speed<select id="speechRate" aria-label="Choose reading speed">
          <option value="0.8">Slow</option><option value="1">Normal</option><option value="1.2">Fast</option><option value="1.4">Very fast</option>
        </select></label>
        <label class="reader-check"><input type="checkbox" id="skipCode"/> Skip code examples while reading</label>
      </div>
      <div class="reader-actions">
        <button class="btn btn-primary" id="readLesson" ${supportedReader ? '' : 'disabled'}>▶ Read lesson</button>
        <button class="btn btn-secondary" id="pauseLesson" disabled>⏸ Pause</button>
        <button class="btn btn-secondary" id="stopLesson" disabled>⏹ Stop</button>
      </div>`;

    const rate = document.getElementById('speechRate');
    const skip = document.getElementById('skipCode');
    if (rate) rate.value = prefs.rate;
    if (skip) skip.checked = prefs.skipCode;
    loadVoices();
    const voice = document.getElementById('speechVoice');
    if (voice && prefs.voice && voices[Number(prefs.voice)]) voice.value = prefs.voice;

    ['speechVoice', 'speechRate', 'skipCode'].forEach(id => document.getElementById(id)?.addEventListener('change', savePrefs));
    document.getElementById('readLesson')?.addEventListener('click', () => readChapter(chapter));
    document.getElementById('pauseLesson')?.addEventListener('click', pauseReader);
    document.getElementById('stopLesson')?.addEventListener('click', stopReader);
    updateButtons();
  };

  window.stopLessonReader = stopReader;
  if (supported()) {
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    window.addEventListener('beforeunload', () => window.speechSynthesis.cancel());
  }
})();
