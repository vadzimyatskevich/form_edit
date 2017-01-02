jQuery(document).ready(function ($) {

    var $tab = $('.tabs').children().children();
    var $model;
    
    // make form elements sortable
    $( "[data-drop *= 'sortable']" ).sortable();
    $( "[data-drop *= 'sortable']" ).disableSelection();
    // listeners
    $('.modal-button').on("click", function (){modalShow(this);});
    $('#server_post').on("click", function (){serverPost();});
    //load all saved forms into table
    formGet();
    //modal window buttons
    $('.modal-background, .modal-close').on("click", modalHide);
    $("#mod_close").on("click", modalHide); // do nothing simply hide modal
    $('#mod_save').on("click", modelSave);
    $('#mod_delete').on("click", modelDelete);
    $('#form_save').on("click", formSave);
    
    // Tabs toggle functions 
    $tab.on('click',function() {
        $(this).addClass("is-active");
        $(this).siblings().removeClass("is-active");
        $block = $(this).attr('data-tab');
        $('#'+$block).siblings().not(".tabs").css({"display":"none"});
        $('#'+$block).css({"display":"inline"});
    });


    /**
     * Notification div hover animation
     */
    var $notifications = $('.notification');
    $notifications
        .mouseenter(function() {
          $(this).addClass("is-white");
        })
        .mouseleave(function() {
          $(this).removeClass("is-white");
        });

    /**
     * "Click to edit" on form elements
     */
    $("[data-click *= 'clickable']").on("click", function (event){
        event.preventDefault();
        console.log(event.target);
        modalShow(this);
    });

    /**
     * Fancy user interactions
     */    
    // form tmplates draggable
    $("[data-drag = 'draggable']").draggable({
        containment: '.container',
        cursorAt: { top: 5, left: 5  },
        snap: '#content',
        helper: 'clone'
    });


    // droppable zone
    $("[data-drop *= 'droppable']").droppable({
            tolerance: "pointer",
            accept:"[data-drag = 'draggable']",
            drop: function( event, ui ) {
                var $content = ui.draggable.clone()
                        .removeAttr('data-drag')
                        .attr("data-click",'clickable')
                        .removeClass("notification")
                        .addClass("content");
                $(this).append($content);
                $("[data-click *= 'clickable']").on("click", function (event){
                    event.preventDefault();
                    console.log(event.target);
                    modalShow(this);
                });

            }
        });

    /**
     * Show modal window
     * @param {type} $obj
     * @returns {undefined}
     */
    function modalShow(obj) {
        var $target = $('.modal');
        $model = $(obj);
        $('#window-content').html(modalUpdate($model));
        $('html').addClass('is-clipped');
        $target.addClass('is-active');
    }
    
    /**
     * Hide modal window
     * @returns {undefined}
     */
    function modalHide() {
        var target = $('.modal');
        $('#window-content').html('');
        $('html').removeClass('is-clipped');
        $(target).removeClass('is-active');
    }

    /**
     * Update modal content depending on editable form element
     * @param {type} type
     * @param {type} $modal
     * @returns {undefined}
     */
    function modalUpdate($obj){
        var label, value, help, id, placeholder, type;
        var optionVal = [];
        var optionName = [];
        var ret;
        switch($obj.attr('data-type')) {
            case 'input':
                id =  $obj.find('input').attr('id');
                label = $obj.find('label').text();
                placeholder = $obj.find('input').attr('placeholder');
                help = $obj.find('span').text();
                ret = '<p class="content"><label class="label">ID/name</label><input class="input" id="mod_id" type="text" value="'+id+'"></p>'
                     +'<p class="content"><label class="label">Label</label><input class="input" id="mod_label" type="text" value="'+label+'"></p>'
                     +'<p class="content"><label class="label">Placeholder</label><input class="input" id="mod_plchld" type="text" value="'+placeholder+'"></p>'
                     +'<p class="content"><label class="label">Help</label><input class="input" id="mod_help" type="text" value="'+help+'"></p>';
                break;
            case 'textarea':
                id =  $obj.find('textarea').attr('id');
                label = $obj.find('label').text();
                placeholder = $obj.find('textarea').attr('placeholder');
                help = $obj.find('span').text();
                ret = '<p class="content"><label class="label">ID/name</label><input class="input" id="mod_id" type="text" value="'+id+'"></p>'
                     +'<p class="content"><label class="label">Label</label><input class="input" id="mod_label" type="text" value="'+label+'"></p>'
                     +'<p class="content"><label class="label">Placeholder</label><input class="input" id="mod_plchld" type="text" value="'+placeholder+'"></p>'
                     +'<p class="content"><label class="label">Help</label><input class="input" id="mod_help" type="text" value="'+help+'"></p>';
                break;
            case 'select':
                id =  $obj.find('select').attr('id');
                label = $obj.find('label').text();
                $obj.find('option').each(function(index, element) {
                    optionVal.push($(element).val());
                    optionName.push($(element).text());
                });
                ret = '<p class="content"><label class="label">ID/name</label><input class="input" id="mod_id" type="text" value="'+id+'"></p>'
                     +'<p class="content"><label class="label">Label</label><input class="input" id="mod_label" type="text" value="'+label+'"></p>'
                     +'<p class="content"><label class="label">Values</label><textarea class="textarea" id="mod_value" type="text" value="">'+optionVal.toString()+'</textarea></p>'
                     +'<p class="content"><label class="label">Names</label><textarea class="textarea" id="mod_name" type="text" value="">'+optionName.toString()+'</textarea></p>';
                break;
            case 'checkbox':
                id =  $obj.find('input').attr('name'); // group name !id !!!
                $obj.find('label').each(function(index, element) {
                    optionName.push($(element).text());
                });
                $obj.find('input').each(function(index, element) {
                    optionVal.push($(element).val());
                });
                ret = '<p class="content"><label class="label">ID/name</label><input class="input" id="mod_id" type="text" value="'+id+'"></p>'
                     +'<p class="content"><label class="label">Values</label><textarea class="textarea" id="mod_value" type="text" value="">'+optionVal.toString()+'</textarea></p>'
                     +'<p class="content"><label class="label">Labels</label><textarea class="textarea" id="mod_name" type="text" value="">'+optionName.toString()+'</textarea></p>';
                break;
            case 'radio':
                id =  $obj.find('input').attr('name'); // group name !id !!!
                $obj.find('label').each(function(index, element) {
                    optionName.push($(element).text());
                });
                $obj.find('input').each(function(index, element) {
                    optionVal.push($(element).val());
                });
                ret = '<p class="content"><label class="label">ID/name</label><input class="input" id="mod_id" type="text" value="'+id+'"></p>'
                     +'<p class="content"><label class="label">Values</label><textarea class="textarea" id="mod_value" type="text" value="">'+optionVal.toString()+'</textarea></p>'
                     +'<p class="content"><label class="label">Radios</label><textarea class="textarea" id="mod_name" type="text" value="">'+optionName.toString()+'</textarea></p>';
                break;
            case 'button':
                id =  $obj.find('button').attr('name'); //
                label = $obj.find('button').text();
                type =  $obj.find('button').attr('type'); //
                ret = '<p class="content"><label class="label">ID/name</label><input class="input" id="mod_id" type="text" value="'+id+'"></p>'
                    + '<p class="content"><label class="label">Label</label><input class="input" id="mod_label" type="text" value="'+label+'"></p>'
                    + '<p class="content"><label class="label">Type</label><input class="input" id="mod_type" type="text" value="'+type+'"></p>';
                break;
            case 'file':
                id =  $obj.find('input').attr('name'); //
                label = $obj.find('label').text();
                ret = '<p class="content"><label class="label">ID/name</label><input class="input" id="mod_id" type="text" value="'+id+'"></p>'
                    + '<p class="content"><label class="label">Label</label><input class="input" id="mod_label" type="text" value="'+label+'"></p>';
                break;
            case 'form':
                //action, mmethod, name
                label = $obj.text();
                ret = '<p class="content"><label class="label">Name</label><input class="input" id="mod_label" type="text" value="'+label+'"></p>';
                break;
            default:
                ret = 'unknown item';
                break;
        }
        return ret;
    };


    /**
     * Update form content
     * @returns {undefined}
     */
    function modelSave() {
        var label, value, name, help, id, placeholder, type;
        var optionVal = [];
        var optionName = [];
        id = $('#mod_id').val();
        label = $('#mod_label').val();
        type =  $('#mod_type').val();
        value = $('#mod_value').val();
        name = $('#mod_name').val();
        placeholder = $('#mod_plchld').val();
        help =  $('#mod_help').val();
//        console.log(id, label, value, name, placeholder, type, help);
//        console.log($model);

        switch($model.attr('data-type')) {
            case 'input':
                $model.find('label').text(label);
                $model.find('input').attr({id: id, name: id, placeholder: placeholder });
                $model.find('span').text(help);
                break;
            case 'textarea':
                $model.find('label').text(label);
                $model.find('textarea').attr({id: id, name: id, placeholder: placeholder });
                $model.find('span').text(help);
                break;
            case 'select':
                $model.find('label').text(label);
                $model.find('select').attr({id: id, name: id});
                optionVal = value.split(",");
                optionName = name.split(",");
                $model.find('select').children().remove(); //clear options
                $.each(optionVal, function(key, value) {   
                    $model.find('select').append( $('<option>', { value: optionVal[key]}).text(optionName[key]));
                });
                break;
            case 'checkbox':
                optionVal = value.split(",");
                optionName = name.split(",");
                $model.children().remove(); //remove old
                $.each(optionVal, function(key, value) {   
                    tmp = $('<input>', { 
                            type: 'checkbox',
                            name: "checkboxes",
                            id: ''+id+'-'+key,
                            value: ''+optionVal[key]});

                    $model.append( $('<label>', {class: 'checkbox'}).text(optionName[key]).prepend(tmp));

                });
                break;
            case 'radio':
                optionVal = value.split(",");
                optionName = name.split(",");
                $model.children().remove(); //clear options
                $.each(optionVal, function(key, value) {   

                    tmp = $('<input>', { 
                            type: 'radio',
                            name: "radios",
                            id: ''+id+'-'+key,
                            value: ''+optionVal[key]});

                    $model.append( $('<label>', {class: 'radio'}).text(optionName[key]).prepend(tmp));

                });
                break;
            case 'button':
                $model.find('button').attr({id: id, name: id, type: type}).text(label);
                break;
            case 'file':
                $model.find('label').text(label);
                $model.find('input').attr({id: id, name: id, placeholder: placeholder });
                break;
            case 'form': 
                $model.text(label);
                break;
            default:
                break;
        };
        formSave();
        modalHide();
    }

    /**
     * Delete form element (delete button in modal window)
     * @returns {undefined}
     */
    function modelDelete() {
        // keep form header
        if( $model.attr('data-type') !== 'form' ){
            $model.remove();
            modalHide();
        }
    }


    /**
     * Create html form code
     * @returns {undefined}
     */
    function formSave() {
        name = $(".message-header").text(); // get form name
        content = '<form>\n<fieldset>\n<legend>'+name+'</legend>';
        //parse all form elements
        $('.message-body').find('div').each(function (index, element){
            content += formParser($(this));
        });
        content += '\n</fieldset>\n</form>';
        $('#form_text').text(content);
//        $('#testzone').html(content);
        $( "[data-tab *= 'html_form']" ).trigger( "click" );
    }
    
    /**
     * Delete form from database
     * @param {type} id
     * @returns {undefined}
     */
    function formDelete(id){
        $.ajax({
            url: 'api.php/forms/'+id,
            type: 'DELETE',
            success: function(result) {
                if(result == 1){
//                    console.log("OK " + result)
                } else {
//                    console.log("FAIL " + result)
                }

            }
        });
    }
    
    /**
     * Load form html code
     * @param {type} id
     * @returns {undefined}
     */
    function formLoad(id){
        $.ajax({
            url: 'api.php/forms/'+id,
            type: 'GET',
            success: function(result) {
                obj = JSON.parse(result);
                    console.log(obj);
                    $('#form_text').text(obj.form);
            }
        });
        // show html tab
        $( "[data-tab *= 'html_form']" ).trigger( "click" );
    }
    
    /**
     * Purify and create html code from editable form
     * @param {type} form
     * @returns {undefined}
     */
    function formParser($form){
        var optionVal = [];
        var optionName = [];
        var ret = '';
        var id, placeholder,label,type;

        switch($form.attr('data-type')){
            case 'input':
                id = $form.find('input').attr('id');
                placeholder = $form.find('input').attr('placeholder');
                ret += '\n<p class="control"><label class="label">'+$form.find('label').text()+'</label>';
                ret += '\n<input class="input" id="'+id+'" name="'+id+'" placeholder="'+placeholder+'">';
                ret += '\n<span class="help">'+$form.find('span').text()+'</span>\n</p>';
                break;
            case 'textarea':
                id = $form.find('textarea').attr('id');
                placeholder = $form.find('textarea').attr('placeholder');
                ret += '\n<p class="control">\n<label>'+$form.find('label').text()+'</label>';
                ret += '\n<textarea class="textarea" id="'+id+'" name="'+id+'" placeholder="'+placeholder+'"></textarea>';
                ret += '\n<span class="help">'+$form.find('span').text()+'</span>\n</p>';
                break;
            case 'select':
                id = $form.find('select').attr('id');
                label = $form.find('label').text();
                $form.find('option').each(function(index, element) {
                    optionVal.push($(element).val());
                    optionName.push($(element).text());
                });
                ret += '\n<p class="control">\n<label class="label">'+label+'</label>'
                ret += '\n<span class="select">\n<select id ="'+id+'" name="'+id+'" >';
                $.each(optionVal, function(key, value) {   
                    ret +='\n<option value ="'+optionVal[key]+'">'+ optionName[key]+'</option>';
                });
                ret +='\n</select>\n</span>\n</p>';
                break;
            case 'checkbox':
                console.log('checkbox');
                id = $form.find('input').attr('name');
                $form.find('input').each(function (index,element){
                    console.log(element);
                    optionVal.push($(element).attr('name'));
                    optionName.push($(element).parent().text());
                })
                ret+='\n<p class="control">';
                $.each(optionVal, function(key, value) {   
                    ret +='\n<label class = "checkbox"><input type="checkbox" name="'
                            +optionVal[key]+'-'+key+'"'+'"id="'
                            +optionVal[key]+'-'+key+'"'+' >'
                            + optionName[key]+'</label>';
                });
                ret+='\n</p>';
//                            <input type="checkbox" name="checkboxes" id="checkboxes-1" value="2">
//                            ret += '<input type="checkbox">'
                break;
            case 'radio':
                console.log('radio');
                id = $form.find('input').attr('name');
                $form.find('input').each(function (index,element){
                    console.log(element);
                    optionVal.push($(element).attr('name'));
                    optionName.push($(element).parent().text());
                })
                ret+='<p class="control">';
                $.each(optionVal, function(key, value) {   
                    ret +='\n<label class = "radio"><input type="radio" name="'
                            +optionVal[key]+'-'+key+'"'+'"id="'
                            +optionVal[key]+'-'+key+'"'+' >'
                            + optionName[key]+'</label>\n';
                });
                ret+='</p>';
                break;
            case 'button':
                id = $form.find('button').attr('id');
                type = $form.find('button').attr('type');
                label = $form.find('button').text();
                ret+='<p class="control"><a class="button" id="'+id+'" name="'+id+'" style="" type="'+type+'">'+label+'</a></p>';
                console.log('button');
                break;
            case 'file':
                console.log('file');
                id = $form.find('input').attr('id');
                label = $form.find('label').text();
                ret+='\n<p class="control">\n<input id="'+id+'" name="'+id+'" style="" type="file">\n</p>';
                break;
            case 'form':
                console.log('form');
                break;
            default:
                break;
        }
        return ret;
    }


    /**
     * Create table of forms stored in database
     * @returns {undefined}
     */
    function formGet(){
        $('#tbl_forms tbody > tr').empty();
        $.getJSON( "api.php/forms", function( data ) {
          var items = [];
          $.each( data, function( key, val ) {
            items.push( "<tr><td>" + val.id + "</td>"
                       +"<td> '" + val.name + "'</td>"
                       +'<td class="is-icon"><a href="#" data-form_load="'+val.id+'"><i class="fa fa-download"></i></a></td>'
                       +'<td class="is-icon"><a href="#" data-form_delete="'+val.id+'"><i class="fa fa-remove"></i></a></td></tr>' //
                    );
          });
          $("#tbl_forms").append( items );
          //
          $("[data-form_delete]").on("click", function (){
              formDelete($(this).attr('data-form_delete')); //del from database
              $(this).closest( "tr" ).remove();             //remove tbl row
          });
          //
          $("[data-form_load]").on("click", function (){
              formLoad($(this).attr('data-form_load')); //del from database
          });

        });
    }

    /**
     * Save form
     * @returns {undefined}
     */
    function serverPost(){ 
        name = $(".message-header").text(); //form name
        $.post( "api.php/forms", JSON.stringify({ name: name, form: $('#form_text').text() }),function( data ) {
            console.log( "ID " + data ); //
            ;
        }).done(formGet());

    }



});


