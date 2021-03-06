var num_shots_taken = 0;
var global_selfies  = [];

document.getElementById("manual_radio").addEventListener("change", function()
{
    document.getElementById("uploadform4").style.display = 'none';
    document.getElementById("uploadform").style.display = 'block';

});

document.getElementById("auto_radio").addEventListener("change", function()
{
    document.getElementById("uploadform").style.display = 'none';
    document.getElementById("uploadform4").style.display = 'block';

    document.getElementById("num_shots").innerHTML = num_shots_taken; 

});

function update_selfie_count() 
{
    num_shots_taken += 1;

    console.log(num_shots_taken);
    document.getElementById("num_shots").innerHTML = num_shots_taken;
}


$(function() {
    $('#initialize_training_button').click(function() {
        event.preventDefault();
        training_name = document.getElementById("training_name").value;

        document.getElementById("training_data").setAttribute("name",training_name);
        var form_data = new FormData($('#uploadform')[0]);
        $.ajax({
            type: 'POST',
            url: '/acct_creation',
            data: form_data,
            contentType: false,
            processData: false,
            dataType: 'json'
        }).done(function(data, textStatus, jqXHR){
            console.log(data);
            console.log(textStatus);
            console.log(jqXHR);
            alert("Account Initialization Success! We will send an email when your account is ready for testing.");
 
            epoch = document.getElementById("epoch_slider").value ;
            lr = document.getElementById("lr_slider").value ;
            beta = document.getElementById("beta_slider").value ;
            email = document.getElementById("email").value ;

           $.ajax({
                type: 'POST',
                url: '/train',
                data: {
                    "name":training_name,
                    "email": email,
                    "learning_rate":lr,
                    "beta":beta,
                    "epoch":epoch
                }
            });

        }).fail(function(data){
            console.log('error!');
            alert("Something went wrong during Account Initialization! Try under a new account name or check your files!");
        });
    });}); 



        var width = 320;
        var height = 0;
        var streaming = false;
        var latest_data_url;
        
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(function (stream) {video.srcObject = stream; video.play();})
            .catch(function (err) {console.log("An error occured! " + err);});
        
        video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
        
            streaming = true;
        }
        }, false);
        
        startbutton.addEventListener('click', function (ev) {
        takepicture();
        ev.preventDefault();
        }, false);
        
        clearphoto();
        

        function  clearphoto() {
            var context = canvas.getContext('2d');
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);
            }
        
        function takepicture() {
        update_selfie_count(); 
        var context = canvas.getContext('2d');
        if (width && height) 
        {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            var dataURL = canvas.toDataURL("image/jpeg");
            global_selfies.push(dataURL);
            
        
            if (dataURL && dataURL != "data:,") 
            {
                //nothng
            } 
            else 
            {
                alert("Image not available");
            }
        }   
        else 
        {
            clearphoto();
        }
        }

        $(function() {
        
        $('#initialize_training_button_v2').click(function() {
            event.preventDefault();
            training_name  = document.getElementById("training_name").value;
            data = {"images": JSON.stringify(global_selfies),"name": training_name}
        
            $.ajax({
                type: 'POST',
                url: '/acct_creation_v2',
                data: data
            }).done(function(data, textStatus, jqXHR){
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
                console.log('Success!');
                alert("Account Initialization Success! We will send an email when your account is ready for testing");
 
                epoch = document.getElementById("epoch_slider").value ;
                lr = document.getElementById("lr_slider").value ;
                beta = document.getElementById("beta_slider").value ;
                email = document.getElementById("email").value ;

                $.ajax({
                    type: 'POST',
                    url: '/train',
                    data: {
                        "name":training_name,
                        "email": email,
                        "learning_rate":lr,
                        "beta":beta,
                        "epoch":epoch
                    }
                });
            }).fail(function(data){
                console.log('error!');
                alert("Something went wrong during Account Initialization! Try under a new account name or check your files!");

            });
        });
        }); 