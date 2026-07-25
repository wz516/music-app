import { demoScore } from '../dist/core/demoScore.js';
import { buildProductionProject } from '../dist/core/pipeline.js';

const runDemoButton = document.querySelector('#run-demo');
const fileInput = document.querySelector('#score-file');
const fileStatus = document.querySelector('#file-status');
const issuesContainer = document.querySelector('#issues');
const pianoRoll = document.querySelector('#piano-roll');
const tracksContainer = document.querySelector('#tracks');
const exportsContainer = document.querySelector('#exports');

runDemoButton.addEventListener('click', () => renderProject(buildProductionProject(demoScore)));

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  fileStatus.textContent = file
    ? `已选择 ${file.name}。Demo 会先用内置样例展示产品流程，下一步可接入 OMR 服务解析该文件。`
    : '尚未选择文件。';
});

function renderProject(project) {
  renderIssues(project.issues);
  renderPianoRoll(project.performance);
  renderTracks(project.arrangement);
  renderExports(project.exportTargets);
}

function renderIssues(issues) {
  if (issues.length === 0) {
    issuesContainer.className = 'issue-list empty';
    issuesContainer.textContent = '没有发现需要人工校对的问题。';
    return;
  }

  issuesContainer.className = 'issue-list';
  issuesContainer.replaceChildren(...issues.map((issue) => {
    const item = document.createElement('article');
    item.className = 'issue';
    item.innerHTML = `<strong>${issue.severity.toUpperCase()} · ${issue.noteId ?? 'score'}</strong><p>${issue.message}</p><small>${issue.suggestedFix ?? ''}</small>`;
    return item;
  }));
}

function renderPianoRoll(events) {
  pianoRoll.replaceChildren(...events.map((event) => {
    const row = document.createElement('div');
    row.className = 'note-row';
    const label = `${event.pitch.step}${event.pitch.alter === 1 ? '#' : event.pitch.alter === -1 ? '♭' : ''}${event.pitch.octave}`;
    const width = Math.max(10, event.humanizedDurationBeats * 18);
    const offset = Math.max(0, event.humanizedStartBeat * 4);
    row.innerHTML = `
      <strong>${label}</strong>
      <div class="note-bar-wrap"><div class="note-bar" style="width:${width}%; margin-left:${offset}%;"></div></div>
      <small>${event.expression.articulation} · ${event.expression.timingOffsetMs}ms · v${event.velocity}</small>
    `;
    return row;
  }));
}

function renderTracks(tracks) {
  tracksContainer.className = 'tracks';
  tracksContainer.replaceChildren(...tracks.map((track) => {
    const card = document.createElement('article');
    card.className = 'track-card';
    card.innerHTML = `<strong>${track.role}</strong><span>${track.instrument}</span><p>${track.events.length} 个演奏事件</p>`;
    return card;
  }));
}

function renderExports(targets) {
  exportsContainer.replaceChildren(...targets.map((target) => {
    const pill = document.createElement('span');
    pill.className = 'export-pill';
    pill.textContent = target;
    return pill;
  }));
}

renderProject(buildProductionProject(demoScore));
