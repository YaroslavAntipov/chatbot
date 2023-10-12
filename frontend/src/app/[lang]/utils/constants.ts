export const FALLBACK_SEO = {
    title: "Chatbot Generator",
    description: "Chatbot Generator",
};

export enum TYPE {
    TRUE_FALSE = "true-false",
    SHORT_ANSWER = "short-answer",
    MULTIPLE_CHOICE = "multiple-choice",
    MULTIPLE_RESPONSE = "multiple-response",
}

export function groupBy<T extends {}>(list: T[], keyGetter: (key: T) => string) {
    const map = new Map<string, T[]>();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });

    return Array.from(map, ([_user, value]) => value);
}

export const getScriptText = (chatbotId: number) => {
    return `
    <style type="text/css">
        .active {
            display: block;
        }
        .inactive {
            display: none;
        }
        .popup-wrapper {
            position: absolute;
            left: 30px;
            bottom: 30px;
        }
        #popup-content {
            width: 300px;
            height: 500px;
            border: 1px solid black;
            border-radius: 10px;
            margin: 5px;
        }
        #popup-button-open, #popup-button-close {
            width: 50px;
            height: 50px;
            color: white;
            background-color: dimgray;
            border-radius: 10px;
        }
    </style>
        <div class="popup-wrapper">
            <div id="popup-content" class="inactive">
                <iframe width="300px" height="500px" style="border: none; border-radius: 10px;" src="${window.location.origin}/en/review/${chatbotId}"></iframe>
            </div>
            <button id="popup-button-open" class="active">Open</button>
            <button id="popup-button-close" class="inactive">Close</button>
        </div>
    <script>
        const openChatbotBtn = document.getElementById("popup-button-open");
        const closeChatbotBtn = document.getElementById("popup-button-close");
        const chatbotPopup = document.getElementById("popup-content");

        openChatbotBtn.addEventListener("click", () => {
            chatbotPopup.className = "active";
            closeChatbotBtn.className = "active";
            openChatbotBtn.className = "inactive";
        });

        closeChatbotBtn.addEventListener("click", () => {
            chatbotPopup.className = "inactive";
            closeChatbotBtn.className = "inactive";
            openChatbotBtn.className = "active";
        });
    </script>
`};
