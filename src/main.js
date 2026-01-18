import { createClient } from '@supabase/supabase-js'

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
// Initialize Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseKey)

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!')
  alert('Supabase configuration is missing. Please check your .env file.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

  const holeBtn = document.getElementById('holeBtn');
  const wrap = document.getElementById('wrap');
  const typedEl = document.getElementById('typed');
  const form = document.getElementById('waitlistForm');
  const emailEl = document.getElementById('email');
  const statusEl = document.getElementById('status');

  const COPY = "playdates is launching soon. \n sign up to be the first to go on a playdate.";

  let opened = false;
  let typingTimer = null;


function typeText(text, speed = 22){
  typedEl.textContent = "";
  const caret = document.createElement('span');
  caret.className = "caret";
  caret.textContent = "▍";
  typedEl.appendChild(caret);

  let i = 0;
  function tick(){
    // insert before caret
    caret.insertAdjacentText('beforebegin', text[i] || "");
    i++;
    if (i <= text.length){
      typingTimer = setTimeout(tick, speed);
    } else {
      // done typing: keep caret for a beat, then remove
      setTimeout(() => caret.remove(), 450);
    }
  }
  tick();
}

function openHole(){
  if (opened) return;
  opened = true;

  wrap.classList.add('opened');
  holeBtn.setAttribute('aria-expanded', 'true');

  // typing
  clearTimeout(typingTimer);
  typeText(COPY);

  // focus email shortly after open
  setTimeout(() => emailEl.focus(), 520);
}

function closeHole(){
  if (!opened) return;
  opened = false;

  wrap.classList.remove('opened');
  holeBtn.setAttribute('aria-expanded', 'false');

  // clear typing
  clearTimeout(typingTimer);
  typedEl.textContent = "";
}

holeBtn.addEventListener('click', () => {
  if (opened) {
    closeHole();
  } else {
    openHole();
  }
});

// Close hole when clicking outside
wrap.addEventListener('click', (e) => {
  if (opened && !holeBtn.contains(e.target)) {
    closeHole();
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = (emailEl.value || "").trim().toLowerCase();

  // basic sanity check (browser will also validate)
  if (!email || !email.includes('@')) {
    statusEl.textContent = "Please enter a valid email.";
    return;
  }

  try {
    statusEl.textContent = "Signing you up...";

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: email
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      statusEl.textContent = "Something went wrong. Please try again.";
      return;
    }

    // Success - hide the email input and show only the success message
    emailEl.style.display = 'none';
    statusEl.textContent = "You're on the list! ✨";
    statusEl.style.fontSize = '18px';
    statusEl.style.fontWeight = '600';

  } catch (error) {
    console.error('Error:', error);
    statusEl.textContent = "Something went wrong. Please try again.";
  }
});

  // Optional: allow opening via keyboard focus + Enter (button already does)
});