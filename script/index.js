function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

function createElements(arr) {
  const elements = arr.map(
    (el) =>
      `<span class="px-3 py-2 rounded-sm cursor-pointer bg-blue-100">${el}</span>`
  );
  return elements.join(" ");
}

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessions = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      displayLessions(data.data);
    });
};

const removeActive = () => {
  const lessionBtns = document.querySelectorAll(".lesson-btn");

  lessionBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      removeActive(); // remove all active class
      const clickedBtn = document.getElementById(`lesson-btn-${id}`);
      clickedBtn.classList.add("active"); //add active class
      displayLevelWords(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  displayWordDetails(data.data);
};

const displayWordDetails = (word) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
            <div class="space-y-3">
            <h2 class="text-2xl font-bold">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i>:ইগার)
            </h2>
            <div>
              <h5 class="font-semibold">Meaning</h5>
              <p class="font-bangla">${word.pronunciation}</p>
            </div>
            <div>
              <h5 class="font-semibold">Example</h5>
              <p class="text-gray-500">
                ${word.sentence}
              </p>
            </div>
            <div>
              <h5 class="font-semibold">সমার্থক শব্দ গুলো</h5>
              <div class="flex gap-2">
                ${createElements(word.synonyms)}
              </div>
            </div>
          </div>
  `;

  document.getElementById("word_modal").showModal();
};

const displayLevelWords = (words) => {
  const lessionWordContainer = document.getElementById(
    "lession-word-container"
  );
  lessionWordContainer.innerHTML = "";

  if (words.length === 0) {
    const lessionNotSelect = document.getElementById("lession-not-select");
    lessionNotSelect.innerHTML = "";

    lessionWordContainer.innerHTML = `
          <div id="lession-not-found" class="space-y-5 col-span-3">
            <i
              class="fa-solid fa-triangle-exclamation text-8xl text-  [#666a70]"
            ></i>
            <p class="font-bangla">
              এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>
            <h3 class="font-bangla font-semibold text-4xl">নেক্সট Lesson এ যান</h3>
          </div>
    `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const WordCard = document.createElement("div");
    WordCard.innerHTML = `
            <div class="lession-card p-10 space-y-5 bg-white rounded-md grid">
              <h3 class="text-2xl font-semibold">${
                word.word ? word.word : "শব্দ পাওয়া যায়নি।"
              }</h3>
              <p class="font-medium"><span>Meaning</span>/<span></span>Pronouncation</p>
              <h3 class="text-2xl font-semibold font-bagla">"${
                word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি।"
              } / ${
      word.pronunciation ? word.pronunciation : "Pronounciation পাওয়া যায়নি।"
    }"</h3>
              <div class="flex justify-between">
                <div onclick="loadWordDetail(${
                  word.id
                })" id="word-info" class="cursor-pointer p-3 bg-blue-200 rounded-md"><i class="fa-solid fa-circle-info"></i></div>
                <div id="word-sound" onclick="pronounceWord('${word.word}')" class="cursor-pointer p-3 bg-blue-200 rounded-md"><i class="fa-solid fa-volume-high"></i></div>
              </div>
            </div>
    `;
    lessionWordContainer.appendChild(WordCard);

    const lessionNotSelect = document.getElementById("lession-not-select");
    lessionNotSelect.innerHTML = "";
  });
  manageSpinner(false);
};

const displayLessions = (lessions) => {
  const lessionContainer = document.getElementById("lession-container");
  lessionContainer.innerHTML = "";

  for (const lession of lessions) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
              <button id="lesson-btn-${lession.level_no}" onclick="loadLevelWord(${lession.level_no})" class="btn btn-outline btn-primary lesson-btn">
            <i class="fa-solid fa-book-open"></i>
            Lession-${lession.level_no}
            </button>
    `;
    lessionContainer.appendChild(btnDiv);
  }
};

loadLessions();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();

  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filteredWords = allWords.filter((word) => {
        return word.word.toLowerCase().includes(searchValue);
      });
      displayLevelWords(filteredWords);
    });
});
