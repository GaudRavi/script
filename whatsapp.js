// Select the node that will be observed for mutations
// window.webkit.messageHandlers.test.postMessage("Did finish loading");
alert("Hello");
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://web.whatsapp.com/", true);

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
        const targetNode = document.querySelector('#app');
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true };

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList) {
            mutationsList.forEach(() => {
                const loadingScreen = document.querySelector(".landing-wrapper");
                if (loadingScreen) {
                    loadingScreen.style.display = "none";
                    handleLoginPage();
                    hideUnusedContentFormLoginPage();
                } else {
                    initializeScriptForResponsiveDesign();
                    handleChatFilterButtonToggle();
                    handleHomeScreenSearchButton();
                    handleNewChatModal();
                }
            });


        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    } else {
      console.log("Failed to load the URL. Status code: " + xhr?.status);
    }
  }
};

xhr.send();

// When user logout.
if (performance.navigation.type === 1) {
    console.log("Page is refreshed");
    let interval;
    function checkElement() {
        const element = document.querySelector(".landing-wrapper");
        if (element) {
            handleLoginPage();
            hideUnusedContentFormLoginPage();
            if(interval) clearInterval(interval);
        }else{
        }
    }

    // Interval to check for the element every 100 milliseconds (adjust as needed)
    interval = setInterval(checkElement, 100);
}

function handleLoginPage(){
    const targetNode = document.querySelector('#app .landing-wrapper .landing-window .landing-main');
    const config = { attributes: true, childList: true };
    if(targetNode){
        const observer = new MutationObserver(hideUnusedContentFormLoginPage);
        observer.observe(targetNode, config);
    }
}

function hideUnusedContentFormLoginPage(){
    const loadingScreen = document.querySelector(".landing-wrapper");
    loadingScreen.style.minWidth = "auto";
    loadingScreen.style.display = "block";
    
    const landingHeader = document.querySelector(".landing-header");
    landingHeader.style.display = "none";
    
    // in windows there is aside and mac doesn't have
    const landingAside = document.querySelector(".landing-window .landing-main aside");
    if(landingAside?.parentElement) landingAside.parentElement.style.height = "100vh";
    if(landingAside) landingAside.style.display = "none";
    
    // const landingTitle = document.querySelector(".landing-window .landing-main .landing-title");
    // landingTitle.innerHTML = "<strong>Dual WhatsApp Guide</strong>";
    
    const landingFooter = document.querySelector(".landing-window ._2XHqw");
    landingFooter.style.display = "none";
    
    const linkWithNumber = document.querySelector(".landing-window .landing-main ._3rDmx");
    linkWithNumber.style.display = "none";

}

function initializeScriptForResponsiveDesign(){
    setModalWidthAuto();
    setLeftSidebarWidthFullScreen();
    addThemeChangeButton();

    // Display contact section in full width
    const contactAndChatSectionDiv = document.querySelector("._1jJ70");
    contactAndChatSectionDiv.style.display = "block";
    contactAndChatSectionDiv.style.minWidth = "auto";


    const contactSections = document.querySelectorAll("._2Ts6i._3RGKj");
    contactSections.forEach((contactSection) => {
        contactSection.style.maxWidth = "100%";
    });


    // Add click event listener to display chat section
    const contactListDiv = document.querySelector("._3YS_f._2A1R8");
    if(contactListDiv){
        contactListDiv.addEventListener("click", openChatModel);



        // contactListDiv.addEventListener("mouseover", (event)=> {
        //     console.log("contactListDiv mouseover called");
        //     if(event?.srcElement){
        //         // const parentDivWithClass = event?.srcElement?.closest('.lhggkp7q.ln8gz9je.rx9719la');
        //         // const parentDivWithClass = event?.srcElement?.closest('div.lhggkp7q.ln8gz9je.rx9719la [title]');
        //         const parentDivWithClass = event?.srcElement?.closest('.lhggkp7q.ln8gz9je.rx9719la').querySelector("[title]");
        //         console.log("parentDivWithClass : ",parentDivWithClass);
        //         if(parentDivWithClass){
        //             const mouseEvent = document.createEvent('MouseEvents');
        //             mouseEvent.initEvent("mousedown", true, true);
        //             parentDivWithClass.dispatchEvent(mouseEvent); 
        //             parentDivWithClass.addEventListener("mousedown", () => {
        //                 setTimeout(() => {
        //                     console.log("parentDivWithClass mouse down event called ");
        //                     openChatModel();
        //                 }, 100);
        //             });
        //         }
        //     }
        // });
    }
}

function hideShowBottomElement(){
    // setTimeout(() => {
        const searchSection = document.querySelectorAll("._2Ts6i._1xFRo");
        searchSection.forEach(info => {
            info.style.display = "none";
        });
    
        setTimeout(() => {
            searchSection.forEach(info => {
                info.style.display = "block";
            });
        }, 100);
    
    // }, 200);

}

function openChatModel(){
    const chatSections = document.querySelectorAll("._2Ts6i._2xAQV");
    const contactSections = document.querySelectorAll("._2Ts6i._3RGKj");
    // Show chat section of selected contact or group
    chatSections.forEach((chatSection) => {
        chatSection.style.display = "block";
    });

    hideShowBottomElement();
    // Get all forward message icon even when user scroll page and load more messages
    const chatPanelDiv = document.querySelector('._5kRIK div[role="application"]');
    const chatPanelConfig = { attributes: true, childList: true };
    const chatPanelObserver = new MutationObserver(() => {
        setTimeout(() => {
            const forwardButtons = document.querySelectorAll("._2Ts6i._2xAQV [data-icon='forward-chat']");
            forwardButtons.forEach(button => {
                handleForwardOrShareButtonAction(button?.parentElement?.parentElement);
            });
        },200);
    });

    chatPanelObserver.observe(chatPanelDiv, chatPanelConfig);

    // Hide contact and group list page
    contactSections.forEach((contactSection) => {
        contactSection.style.display = "none";
    });

    removeVideoCallButton();

    // add back button to navigate page to contact and group list page
    addBackBtn();
    const backButton = document.getElementById("custom_back_btn");
    backButton.addEventListener("click", closeChatAndNavigateToContactListPage);

    // contact info
    const contactInfoBtn1 = document.querySelector("._2pr2H");
    const contactInfoBtn2 = document.querySelector("._2au8k");
    contactInfoBtn1.addEventListener("click", redirectContactInfoORBusinessDetailsSection);
    contactInfoBtn2.addEventListener("click", redirectContactInfoORBusinessDetailsSection);

    handleThreeDotAndSearchIconInContactInfoSection();


    // Handle search message functionality
    const messageSearchIcon = document.querySelector(".AmmtE ._1VwoK ._1sPvB._2XdMx ._3OtEr span[data-icon='search-alt']")?.parentElement;
    console.log("messageSearchIcon : ",messageSearchIcon);
    messageSearchIcon.addEventListener("click", () => {
        console.log("searcg btn clicked");
        setTimeout(() => {
            hideChatSection();

            // Handle close button of search modal
            setTimeout(() => {
                const closeIcon = document.querySelector("._2Ts6i._1xFRo [aria-label='Close']");
                console.log("closeIcon : ",closeIcon);
                if(closeIcon){
                    closeIcon.addEventListener("click", () => {
                        console.log("close btn clicked");
                        setTimeout(() => {
                            showChatSection()
                        });
                    });
                }
            });

            // Handle date filter button
            setTimeout(() => {
                const dateFilterIcon = document.querySelector("._2Ts6i._1xFRo button span[data-icon='calendar-empty']")?.parentElement;
                if(dateFilterIcon){
                    dateFilterIcon.addEventListener("click", () => {
                        setTimeout(() => {
                                const calendar = document.querySelector("._2sDI2.gSziV div.react-calendar .react-calendar__month-view__days");
                                console.log("calendar : ",calendar)
                                if(calendar){
                                    calendar.addEventListener("click", () => {
                                        console.log("button clickde");
                                        setTimeout(showChatSection)
                                    });
                                }
                        }, 200);
                    });
                }
            });


            const targetNode = document.querySelector('.g0rxnol2.jnl3jror.p357zi0d.f8m0rgwh.ggj6brxn.ag5g9lrv.ihvf49ua#pane-side');
            const config = { attributes: true, childList: true };

            // Callback function to execute when mutations are observed
            const callback = function (mutationsList) {
                mutationsList.forEach((mutation) => {
                    if(mutation.target.outerText !== "No messages found"){
                        targetNode.addEventListener("click", () => {
                            setTimeout(() => {
                                const searchSection = document.querySelectorAll("._2Ts6i._1xFRo");
                                searchSection.forEach(info => {
                                    info.style.display = "none";
                                });

                                setTimeout(() => {
                                    searchSection.forEach(info => {
                                        info.style.display = "block";
                                    });
                                }, 500);

                            }, 200);
                        });
                    }

                });
            };

            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);
        }, 200);
    });
}

function handleChatFilterButtonToggle(){
    const filterButton = document.querySelector("[aria-label='Unread chats filter']")
    filterButton.addEventListener("click", () => {
        setTimeout(() => {
            initializeScriptForResponsiveDesign();
        }, 200);
    });
}

function handleHomeScreenSearchButton(){
    const searchInputBox = document.querySelector(".lexical-rich-text-input");
    if(searchInputBox){
        searchInputBox.addEventListener("keyup", () => {
            setTimeout(() => {

                // when click on any contact
                // initializeScriptForResponsiveDesign();

                // incomplete logic for when click on any searched message

                // setTimeout(() => {
                //     const messages = document.querySelectorAll(".g0rxnol2._3fGK2 div[aria-label='Search results.'] div.lhggkp7q.ln8gz9je.rx9719la div.g0rxnol2");
                //     console.log('messages: ', messages);
                //     messages.forEach((message) => {
                //         message.addEventListener("click", () => {
                //             initializeScriptForResponsiveDesign();
                //         });
                //     })
                // }, 200);

                setTimeout(() => {
                    const messages = document.querySelector(".g0rxnol2._3fGK2 div[aria-label='Search results.']");
                    messages.addEventListener("click", () => {
                        setTimeout(() => {
                            openChatModel();
                        }, 200);
                    });
                }, 200);
            }, 200);
    
            const backBtn = document.querySelector("._1EUay button");
            if(backBtn){
                backBtn.addEventListener("click", () => {
                    if(backBtn.ariaLabel === 'Search or start new chat'){
                        initializeScriptForResponsiveDesign();
                    }
                });
            }
            
            setTimeout(() => {
                const clearButton = document.querySelector("._1EUay button[aria-label='Cancel search']");
                if(clearButton){
                    clearButton.addEventListener("click", () => {
                        setTimeout(() => {
                            initializeScriptForResponsiveDesign();
                        }, 200);
                    })
                }
            }, 500);
        });
    }
}

// remove video call button
function removeVideoCallButton() {
    const videoCallButton = document.querySelector('[aria-label="Get the app for calling"]')?.parentElement;
    if(videoCallButton) videoCallButton.style.display = "none";
}

function handleThreeDotAndSearchIconInContactInfoSection(){
    // Handle three dot click on chat section
    const threeDot = document.querySelector("._1VwoK ._3vsRF div span[data-icon='menu']")?.parentNode;
    if (threeDot) {
        threeDot.addEventListener("click", () => {
            setTimeout(() => {
                // handle contact info click action
                const contactInfoOption = document.querySelector("span div ul._3bcLp li div[aria-label='Contact info']")?.parentElement;
                if (contactInfoOption) contactInfoOption.addEventListener("click", redirectContactInfoORBusinessDetailsSection);

                // hanle group info click action
                const groupInfoOption = document.querySelector("span div ul._3bcLp li div[aria-label='Group info']")?.parentElement;
                if (groupInfoOption) groupInfoOption.addEventListener("click", redirectContactInfoORBusinessDetailsSection);


                // handle close chat click action
                const closeChatOption = document.querySelector("span div ul._3bcLp li div[aria-label='Close chat']")?.parentElement;
                if (closeChatOption) closeChatOption.addEventListener("click", closeChatAndNavigateToContactListPage);


                // handle business details click action
                const businessDetailsOption = document.querySelector("span div ul._3bcLp li div[aria-label='Business details']")?.parentElement;
                if (businessDetailsOption) businessDetailsOption.addEventListener("click", redirectContactInfoORBusinessDetailsSection);

                // handle disappearing messages click action
                const disappearingMessageOption = document.querySelector("span div ul._3bcLp li div[aria-label='Disappearing messages']")?.parentElement;
                if(disappearingMessageOption) disappearingMessageOption.addEventListener("click", () => {
                    handleSearchIconAndDisappearingMessage();
                });

            }, 100);
        });
    }

    // Handle search icon click on chat section
    const searchIcon = document.querySelector("._1VwoK ._3OtEr div span[data-icon='search-alt']")?.parentNode;
    if(searchIcon){
        searchIcon.addEventListener("click", () => {
            handleSearchIconAndDisappearingMessage();
        });
    }
}

function handleSearchIconAndDisappearingMessage(){
    const searchSection = document.querySelectorAll("._2Ts6i._1xFRo");
    if (searchSection) {
        searchSection.forEach((info) => {
            info.style.maxWidth = "100%";
            info.style.width = "100%";
        });
    }

    setTimeout(() => {
        const searchSectionCloseBtn = document.querySelector("._2Ts6i._1xFRo .kk3akd72.p6y6hbba");
        // don't change below if condition otherwise you face below error.
        // after navigate back form search section chat section is not display properly.
        if (searchSectionCloseBtn) {
            searchSectionCloseBtn.addEventListener("click", () => {
                searchSection.forEach(info => {
                    info.style.display = "none";
                });

                setTimeout(() => {
                    searchSection.forEach(info => {
                        info.style.display = "block";
                    });
                }, 200);
            });
        }

    }, 200);
}

function addThemeChangeButton() {
    const elementWhereAddThemeBtn = document.querySelector("._2Ts6i._3RGKj header ._604FD ._1sPvB._2XdMx span");
    const themeBtn = document.querySelector("#custom_theme_change");

    if (elementWhereAddThemeBtn && !themeBtn) {
        elementWhereAddThemeBtn.insertAdjacentHTML(
            "afterbegin",
            `<div id="custom_theme_change" aria-disabled="false" role="button" tabindex="0" class="_3ndVb fbgy3m38 ft2m32mm oq31bsqd nu34rnf1" data-tab="2" title="Communities" aria-label="Communities">
                <span data-icon="settings-theme" class="">
                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1">
                        <title>settings-theme</title>
                        <path d="M12,1 L15.219275,4.21927498 L19.780725,4.21927498 L19.780725,8.78072502 L23,12 L19.780725,15.219275 L19.780725,19.780725 L15.219275,19.780725 L12,23 L8.78072502,19.780725 L4.21927498,19.780725 L4.21927498,15.219275 L1,12 L4.21927498,8.78072502 L4.21927498,4.21927498 L8.78072502,4.21927498 L12,1 Z M12,6 L12,18 C15.31,18 18,15.31 18,12 C18,8.76522727 15.4308833,6.12259298 12.2246968,6.00414409 L12,6 Z" fill="currentColor" fill-rule="nonzero"></path>
                    </svg>
                </span>
            </div>`
        );

        const themeChangeBtn = document.querySelector("#custom_theme_change");
        if (themeChangeBtn) {
            themeChangeBtn.addEventListener("click", () => {
                if (document.body.classList.contains("dark")) {
                    document.body.classList.remove("dark");
                } else {
                    document.body.classList.add("dark");
                }
            });
        }
    }
}

function addBackBtn() {
    const elementWhereAddBackBtn = document.querySelector(".AmmtE");
    const backBtn = document.getElementById("custom_back_btn");

    if (elementWhereAddBackBtn && !backBtn) {
        elementWhereAddBackBtn.insertAdjacentHTML(
            "afterbegin",
            `<div class="kk3akd72 p6y6hbba" id="custom_back_btn">
                <div role="button" tabindex="0" aria-label="Back" class="kk3akd72 svlsagor fewfhwl7 ajgl1lbb ltyqj8pj">
                  <span data-icon="back" class="">
                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24">
                      <title>back</title>
                      <path fill="currentColor" d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"></path>
                    </svg>
                  </span>
                </div>
              </div>`
        );
    }
}

function hideChatSection() {
    const chatSections = document.querySelectorAll("._2Ts6i._2xAQV");
    if (chatSections) {
        chatSections.forEach((chatSection) => {
            chatSection.style.display = "none";
        });
    }
}

function showChatSection() {
    const chatSections = document.querySelectorAll("._2Ts6i._2xAQV");
    if (chatSections) {
        chatSections.forEach((chatSection) => {
            chatSection.style.display = "block";
        });
    }
}

function showContactSection() {
    const contactSections = document.querySelectorAll("._2Ts6i._3RGKj");
    if (contactSections.length) {
        contactSections.forEach((contactSection) => {
            contactSection.style.display = "block";
        });
    }
}

//  class="_2Ts6i _1xFRo" contains two sections (contact info, business details)
function showContactInfoSectionORBusinessDetailsSection() {
    const contactInfo = document.querySelectorAll("._2Ts6i._1xFRo");
    if (contactInfo) {
        contactInfo.forEach((info) => {
            info.style.maxWidth = "100%";
            info.style.width = "100%";
        });
    }
}

function hideContactInfoSectionORBusinessDetailsSection() {
    const contactInfoCloseBtn = document.querySelector("._2Ts6i._1xFRo .kk3akd72.p6y6hbba");
    // if (contactInfoCloseBtn) contactInfoCloseBtn.addEventListener("click", showChatSection);
    if(contactInfoCloseBtn){
        contactInfoCloseBtn.addEventListener("click", () => {
            setTimeout(() => {
                hideChatSection();
            }, 100);

            setTimeout(() => {
                showChatSection();
            }, 200);
        })
    }
}

function redirectContactInfoORBusinessDetailsSection() {
    hideChatSection();
    showContactInfoSectionORBusinessDetailsSection()

    // Handle close button of contact section
    setTimeout(hideContactInfoSectionORBusinessDetailsSection);

    // Handle doc, media and link button of contact section
    setTimeout(() => {
        const docMediaBtn = document.querySelector(".ajgl1lbb.i5tg98hk.f9ovudaz.przvwfww.gx1rr48f.or9x5nie");
        if (docMediaBtn) {
            docMediaBtn.addEventListener("click", function () {
                setTimeout(() => {
                    // Handle close button of doc, media and link section
                    const docCloseBtn = document.querySelector(".ppled2lx.tkdu00h0.gfz4du6o.r7fjleex.lhggkp7q.qq0sjtgm.ln8gz9je div header div .kk3akd72.iqmas3e4");
                    docCloseBtn.addEventListener("click", function () {
                        setTimeout(() => {
                            hideContactInfoSectionORBusinessDetailsSection();
                            redirectContactInfoORBusinessDetailsSection();
                        }, 200);
                    });
                }, 200);
            });
        }
    });

    // Handle starred message section
    setTimeout(() => {
        const starredMessages = document.querySelector('div[role="button"][tabindex="0"].gx1rr48f [data-icon="star"]')?.parentNode?.parentNode?.parentNode?.parentNode;
        if (starredMessages) {
            starredMessages.addEventListener("click", function () {
                setTimeout(() => {
                    // Handle close button of starred message section
                    const starredMessagesCloseBtn = document.querySelector(".ppled2lx.tkdu00h0.gfz4du6o.r7fjleex.lhggkp7q.qq0sjtgm.ln8gz9je div header div .kk3akd72.p6y6hbba");
                    starredMessagesCloseBtn.addEventListener("click", function () {
                        setTimeout(() => {
                            hideContactInfoSectionORBusinessDetailsSection();
                            redirectContactInfoORBusinessDetailsSection();
                        }, 200);
                    });
                }, 200);
            });
        }
    });

    // Handle disappearing message section
    setTimeout(() => {
        const disappearingOption = document.querySelector('div[role="button"][tabindex="0"].gx1rr48f [data-icon="disappearing"]')?.parentNode?.parentNode?.parentNode?.parentNode;
        if(disappearingOption){
            disappearingOption.addEventListener("click", () => {
                setTimeout(() => {
                    const disappearingOptionCloseBtn = document.querySelector("._2Ts6i._1xFRo .kk3akd72.p6y6hbba");
                    if (disappearingOptionCloseBtn) {
                        disappearingOptionCloseBtn.addEventListener("click", () => {
                            setTimeout(() => {
                                redirectContactInfoORBusinessDetailsSection();
                            }, 200);
                        });
                    }
                }, 200);
            });
        }
    });

    // Handle encrption section
    setTimeout(() => {
        const encrptionOption = document.querySelector('div[role="button"][tabindex="0"].gx1rr48f [data-icon="lock"]')?.parentNode?.parentNode?.parentNode?.parentNode;
        if(encrptionOption){
            encrptionOption.addEventListener("click", () => {
                setTimeout(() => {
                    // Handle back button of encrption page
                    const encrptionOptionCloseBtn = document.querySelector("._2Ts6i._1xFRo .kk3akd72.p6y6hbba");
                    if (encrptionOptionCloseBtn) {
                        encrptionOptionCloseBtn.addEventListener("click", () => {
                            setTimeout(() => {
                                redirectContactInfoORBusinessDetailsSection();
                            }, 200);
                        });
                    }

                    // Handle ok button on encrption page
                    const encrptionOkButton = document.querySelector("[data-animate-modal-body='true'] button");
                    if(encrptionOkButton){
                        encrptionOkButton.addEventListener("click", () => {
                            setTimeout(() => {
                                redirectContactInfoORBusinessDetailsSection();
                            }, 200);
                        });
                    }

                    // Handle outside modal click
                    const modal = document.querySelector(".cm280p3y.p357zi0d.f8m0rgwh.gndfcl4n.ac2vgrno.ln8gz9je.s4r5ooj2.lffynu9d.sdfuwbjb[role='dialog']");
                    if(modal){
                        modal.addEventListener("click", () => {
                            setTimeout(() => {
                                redirectContactInfoORBusinessDetailsSection();
                            }, 200);
                        });
                    }
                }, 200);
            });
        }
    });

    // Handle group members click event
    setTimeout(() => {
        const groupMembersDiv = document.querySelector(".tt8xd2xn.dl6j7rsh.mpdn4nr2.avk8rzj1 div._3YS_f._2A1R8");
        // Handle group member
        if(groupMembersDiv && groupMembersDiv?.hasAttribute('aria-label')){
            groupMembersDiv.addEventListener("click", () => {
                setTimeout(() => {
                    setTimeout(() => {
                        hideChatSection();
                        redirectContactInfoORBusinessDetailsSection();
                    }, 200);
                    const contactInfoCloseBtn = document.querySelector("._2Ts6i._1xFRo .kk3akd72.p6y6hbba");
                    if (contactInfoCloseBtn) {
                        contactInfoCloseBtn.addEventListener("click", () => {
                            setTimeout(() => {
                                redirectContactInfoORBusinessDetailsSection();
                            }, 200);
                        });
                    }
                }, 200);

                // Handle doc, media and link button of contact section
                setTimeout(() => {
                    const docMediaBtn = document.querySelector(".ajgl1lbb.i5tg98hk.f9ovudaz.przvwfww.gx1rr48f.or9x5nie");
                    if (docMediaBtn) {
                        docMediaBtn.addEventListener("click", function () {
                            setTimeout(() => {
                                const docCloseBtn = document.querySelector(".ppled2lx.tkdu00h0.gfz4du6o.r7fjleex.lhggkp7q.qq0sjtgm.ln8gz9je div header div .kk3akd72.iqmas3e4");
                                docCloseBtn.addEventListener("click", function () {
                                    setTimeout(() => {
                                        redirectContactInfoORBusinessDetailsSection();
                                    }, 200);
                                });
                            }, 200);
                        });
                    }
                });

                // Handle starred message section
                setTimeout(() => {
                    const starredMessages = document.querySelector('div[role="button"][tabindex="0"].gx1rr48f [data-icon="star"]')?.parentNode?.parentNode?.parentNode?.parentNode;
                    if (starredMessages) {
                        starredMessages.addEventListener("click", function () {
                            setTimeout(() => {
                                const starredMessagesCloseBtn = document.querySelector(".ppled2lx.tkdu00h0.gfz4du6o.r7fjleex.lhggkp7q.qq0sjtgm.ln8gz9je div header div .kk3akd72.p6y6hbba");
                                starredMessagesCloseBtn.addEventListener("click", function () {
                                    setTimeout(() => {
                                        redirectContactInfoORBusinessDetailsSection();
                                    }, 200);
                                });
                            }, 200);
                        });
                    }
                });

                // Handle chat button in contact info
                setTimeout(() => {
                    const chatWithMember = document.querySelector("[data-icon='chat']")?.parentElement?.parentElement;
                    if(chatWithMember){
                        chatWithMember.addEventListener("click", () => {
                            setTimeout(openChatModel)
                        })
                    }
                });
            });
        }else if(groupMembersDiv && !groupMembersDiv?.hasAttribute('aria-label')){
            // Handle common group option
            groupMembersDiv.addEventListener("click", openChatModel);
        }
    });

    // Handle common group click action
    setTimeout(() => {
        const commonGroup = document.querySelector("._199zF._3j691.cMa7y._22yb-")?.parentElement;
        if(commonGroup){
            commonGroup.addEventListener("click", () => {
                setTimeout(openChatModel, 200);
            });
        }
    }, 200);

    // Handle share button of contact section
    setTimeout(() => {
        const shareBtn = document.querySelector(".qfejxiq4.oz083wsx.g9zvcdbd [data-icon='forward-filled']")?.parentElement?.parentElement;
        handleForwardOrShareButtonAction(shareBtn);
    });
}

function handleNewChatModal(){
    const newChatIcon = document.querySelector("[data-icon='new-chat-outline']")?.parentElement;
    if(newChatIcon){
        newChatIcon.addEventListener("click", () => {
            setTimeout(() => {
                // const defaultChatSection = document.querySelector("._2Ts6i._2xAQV div._64p9P");
                // console.log('defaultChatSection: ', defaultChatSection);
                // if(!defaultChatSection){
                    const contactList = document.querySelector(".g0rxnol2.g0rxnol2.thghmljt.p357zi0d.rjo8vgbg.ggj6brxn.f8m0rgwh.gfz4du6o.ag5g9lrv.bs7a17vp");
                    if(contactList){
                        contactList.addEventListener("click", () => {
                            setTimeout(openChatModel, 500);
                        });
                    }
                // }else{
                //     closeChatAndNavigateToContactListPage();
                // }
            }, 200);
        });
    }
}

function handleForwardOrShareButtonAction(shareBtn){
    if (shareBtn) {
        // Disconnect existing observer, if any
        if (shareBtn?.observer) {
            shareBtn.observer.disconnect();
        }

        shareBtn.addEventListener("click", () => {
            setTimeout(() => {
                const sendButtonTargetNode = document.querySelector(".nbczt5ty.tvf2evcx.oq44ahr5.lb5m6g5c");
                const sendButtonConfig = { attributes: true, childList: true };
                const sendButtonObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation?.target?.outerText) {
                            const sendButton = document.querySelector(".g0rxnol2.ggj6brxn.m0h2a7mj.r6au09pb.fd365im1.hmy10g0s div span[aria-label='Send']")?.parentElement?.parentElement;
                            if (sendButton) {
                                sendButton.addEventListener("click", () => {
                                    setTimeout(() => {
                                        addBackBtn();
                                        showChatSection();
                                        removeVideoCallButton();
                                        const backButton = document.getElementById("custom_back_btn");
                                        backButton.addEventListener("click", closeChatAndNavigateToContactListPage);
                                        handleThreeDotAndSearchIconInContactInfoSection();

                                        // Handle forward message button of contact section
                                        setTimeout(() => {
                                            const forwardButtons = document.querySelectorAll("._2Ts6i._2xAQV [data-icon='forward-chat']");
                                            forwardButtons.forEach(button => {
                                                handleForwardOrShareButtonAction(button?.parentElement?.parentElement);
                                            });
                                        }, 500);
                                    });
                                })
                            }
                        }
                    });
                });

                sendButtonObserver.observe(sendButtonTargetNode, sendButtonConfig);

                // Store the observer in the shareBtn itself for later reference
                shareBtn.observer = sendButtonObserver;
            }, 500);
        });
    }
}

function setModalWidthAuto() {
    // Define the target nodes and configurations
    const modalTargets = [
        { node: document.querySelector('#app span:nth-child(1)'), config: { attributes: true, childList: true } },
        { node: document.querySelector('#app span:nth-child(2)'), config: { attributes: true, childList: true } },
        { node: document.querySelector('#app span:nth-child(3)'), config: { attributes: true, childList: true } },
        { node: document.querySelector('#app span:nth-child(4)'), config: { attributes: true, childList: true } }
    ];

    // Loop through the modalTargets array
    if (modalTargets) {
        modalTargets.forEach(target => {
            // Disconnect existing observer, if any
            if (target.node?.observer) {
                target.node.observer.disconnect();
            }

            const modalObserver = new MutationObserver((mutations) => {
                setTimeout(() => {
                    const modalDiv = document.querySelector("[role='dialog']");
                    if (modalDiv) modalDiv.style.minWidth = "auto";

                    const modal = document.querySelector("[role='dialog'] div");
                    if (modal) modal.style.width = "90vw";
                });
            });

            modalObserver.observe(target.node, target.config);

            // Store the observer in the node itself for later reference
            target.node.observer = modalObserver;
        });
    }
}

function setLeftSidebarWidthFullScreen() {
    const leftSideBar = document.querySelector("._2QgSC");
    if (leftSideBar) {
        leftSideBar.style.display = "block";
    }

    const chatSections = document.querySelectorAll("._2Ts6i._2xAQV");
    if (chatSections.length) {
        chatSections.forEach((chatSection) => {
            if (chatSection) {
                chatSection.style.display = "none";
            }
        });
    }
}

function closeChatAndNavigateToContactListPage() {
    hideChatSection();
    showContactSection();
}
