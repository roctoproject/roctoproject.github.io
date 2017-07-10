$("document").ready(() => {
  var uiLoaded = false;
  //var socket = io("http://localhost:8000");
  // define a handler for the u key
  function shortcut(e) {
    if (e.keyCode == 85 && !uiLoaded) {
      loadUI();
    }
    if (e.keyCode == 76 && uiLoaded) {
      $("#output").html("");
    }
  }

  var loadUI = function() {
    $.get("./ui.html", (result) => {
      $(".intro").fadeOut(100, () => {
        $(".maincontent").hide().html(result).fadeIn(100);
      });

    }).done(() => {

      // UI functions
      $(".maincontent").on("click", "#request", () => {
        $.get("./js/request.txt", (task) => {
          $("#json").val(task);
        });
      });

      $(".maincontent").on("click", "#submit", () => {
        $.get("./js/submit.txt", (task) => {
          $("#json").val(task);
        });
      });

      $(".maincontent").on("click", "#sendres", () => {
        $.get("./js/sendres.txt", (task) => {
          $("#json").val(task);
        });
      });

      $(".maincontent").on("click", "#showhide", () => {
        var j = $("#json");
        if (j.is(":visible")) {
          j.slideUp(100, () => {
            $("#jsonrow").removeClass("top-buffer");
          });
          $("#showhide").html("Show json");
        } else {
          j.slideDown(100);
          $("#showhide").html("Hide json");
          $("#jsonrow").addClass("top-buffer");
        }
      });

      $(".maincontent").on("click", "#connect", () => {
        var socket = io($("#address").val() + ":" + $("#port").val())
        socket.on("connect", () => {
          $("#status").html("Connected");
        });

        socket.on("disconnect", () => {
          $("#status").html("Not connected");
        });
        
        $(".maincontent").on("click", "#send", () => {
          try {
              var c = JSON.parse($("#json").val());
          } catch(e) {
              $("#output").append("Error: invalid JSON\n")
                          .append(e).append("\n\n"); // error in the above string (in this case, yes)!
          }
          
          socket.emit(c.emit,c.content);
        });
        
        // always put everything in output
        var onevent = socket.onevent;
        socket.onevent = function(packet) {
          var args = packet.data || [];
          onevent.call(this, packet); // original call
          packet.data = ["*"].concat(args);
          onevent.call(this, packet); // additional call to catch-all
        };

        socket.on("*", function(event, data) {
          $("#output").append(event)
            .append("\n" + JSON.stringify(data) + "\n\n")
            .scrollTop($("#output")[0].scrollHeight);
        });
      });



      uiLoaded = true;
      console.log("ui loaded");
    });
  }


  // register the handler 
  document.addEventListener('keyup', shortcut, false);
  console.log("\n%cHi.\n%cPress u to load the ui.\n%chttp://www.github.com/roctoproject%c \n\n", "font-family: Consolas; font-size: 32px; color: #992589", "font-family: consolas; font-size: 16px; color: #767676", "font-family: Helvetica Neue, sans-serif; font-size: 11px; text-decoration: underline; line-height: 1.2rem; color: #767676", "")
});
