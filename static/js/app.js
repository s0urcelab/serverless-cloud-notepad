$(function () {
    var $textarea = $("#contents"),
        // $printarea = $('#printable_contents'),
        $loading = $("#loading"),
        content = $textarea.val();

    // $printarea.text(content);

    setInterval(function () {
        if (content !== $textarea.val()) {
            content = $textarea.val();

            $loading.show();
            $.post('', { t: content }).always(function () {
                $loading.hide();
            });

            // $printarea.text(content);
        }
    }, 1000);
});
